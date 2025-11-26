#!/usr/bin/env node
import * as cheerio from "cheerio";
import inquirer from "inquirer";
import { promises as fs } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// FIXME: https://netflixtechblog.com/
// FIXME: https://rachelbythebay.com/w/

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "src", "content");

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

const colors = {
  info: (msg) => `${ANSI.cyan}${msg}${ANSI.reset}`,
  success: (msg) => `${ANSI.green}${msg}${ANSI.reset}`,
  warn: (msg) => `${ANSI.yellow}${msg}${ANSI.reset}`,
  error: (msg) => `${ANSI.red}${msg}${ANSI.reset}`,
  title: (msg) => `${ANSI.bold}${ANSI.magenta}${msg}${ANSI.reset}`,
};

const ARG_BOOLEAN_FLAGS = new Set(["draft", "showInNav", "force", "interactive", "dryRun", "fetch"]);
const ARG_NUMBER_FLAGS = new Set(["navOrder"]);
const ARG_ARRAY_FLAGS = new Set(["tags", "categories"]);

const TYPE_CONFIG = {
  blog: {
    label: "Blog Post",
    slugSource: (answers) => answers.slug || answers.title || answers.description,
    getFilePath: ({ slug, date }) => {
      if (!slug) {
        throw new Error("Blog posts require a title or slug to generate the filename.");
      }
      return join(CONTENT_DIR, "blog", `${date}-${slug}.md`);
    },
    placeholder: "Write something wonderful here.",
    fields: [
      { name: "title", message: "Title", required: true },
      { name: "description", message: "Description", required: true },
      { name: "tags", message: "Tags (comma separated)", filter: splitList },
      { name: "draft", message: "Save as draft?", type: "confirm", default: false },
      { name: "body", message: "Body (optional)" },
    ],
  },
  bookmarks: {
    label: "Bookmark",
    slugSource: (answers) => answers.slug || answers.title || answers.url,
    getFilePath: ({ slug }) => {
      if (!slug) {
        throw new Error("Bookmarks require a title or slug to generate the filename.");
      }
      return join(CONTENT_DIR, "bookmarks", `${slug}.md`);
    },
    placeholder: "Add bookmark notes here.",
    fields: [
      { name: "title", message: "Title", required: true },
      { name: "url", message: "URL", required: true },
      { name: "categories", message: "Categories (comma separated)", filter: splitList },
      { name: "body", message: "Notes (optional)" },
    ],
  },
  pages: {
    label: "Page",
    slugSource: (answers) => answers.slug || answers.path || answers.title,
    getFilePath: ({ slug }) => {
      if (!slug) {
        throw new Error("Pages require a path or title to generate the filename.");
      }
      return join(CONTENT_DIR, "pages", `${slug}.md`);
    },
    placeholder: "Add your page content here.",
    fields: [
      { name: "title", message: "Title", required: true },
      { name: "description", message: "Description", required: true },
      { name: "path", message: "Path (e.g. /about)", required: true },
      { name: "showInNav", message: "Show in navigation?", type: "confirm", default: false },
      { name: "navLabel", message: "Navigation label", when: (answers) => answers.showInNav === true },
      {
        name: "navOrder",
        message: "Navigation order (number)",
        filter: (val) => (val === "" ? undefined : Number(val)),
        when: (answers) => answers.showInNav === true,
      },
      { name: "ogImage", message: "OG Image path (optional)" },
      { name: "body", message: "Body (optional)" },
    ],
  },
};

async function fetchMetadata(url) {
  try {
    console.log(colors.info(`\nFetching metadata from ${url}...`));
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const metadata = {};

    let jsonLd = null;
    $('script[type="application/ld+json"]').each((_, elem) => {
      try {
        const data = JSON.parse($(elem).html());
        const items = Array.isArray(data) ? data : [data];
        jsonLd =
          items.find((item) => ["Article", "BlogPosting", "WebPage", "WebSite"].includes(item["@type"])) || items[0];
      } catch {
        /* No-op */
      }
    });

    metadata.title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[property="article:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      jsonLd?.headline ||
      jsonLd?.name ||
      $("title").text() ||
      "";

    metadata.description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[property="article:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      jsonLd?.description ||
      "";

    const categories = new Set();
    const keywords = $('meta[name="keywords"]').attr("content");

    if (keywords) {
      keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
        .forEach((k) => categories.add(k));
    }

    $('meta[property="article:tag"]').each((_, elem) => {
      const tag = $(elem).attr("content");
      if (tag) categories.add(tag.trim());
    });

    const section = $('meta[property="article:section"]').attr("content");
    if (section) {
      categories.add(section.trim());
    }

    if (jsonLd?.keywords) {
      const jsonKeywords = Array.isArray(jsonLd.keywords) ? jsonLd.keywords : jsonLd.keywords.split(",");
      jsonKeywords
        .map((k) => k.trim())
        .filter(Boolean)
        .forEach((k) => categories.add(k));
    }
    if (jsonLd?.articleSection) {
      const sections = Array.isArray(jsonLd.articleSection) ? jsonLd.articleSection : [jsonLd.articleSection];
      sections.forEach((s) => categories.add(s.trim()));
    }

    if (categories.size > 0) {
      metadata.categories = Array.from(categories);
    }

    if (metadata.title) {
      metadata.title = metadata.title.trim();
    }
    if (metadata.description) {
      metadata.description = metadata.description.trim();
    }

    console.log(colors.success(`✓ Fetched: ${metadata.title || "(no title found)"}`));
    if (metadata.categories && metadata.categories.length > 0) {
      console.log(`${ANSI.dim}  Categories: ${metadata.categories.join(", ")}${ANSI.reset}`);
    }
    return metadata;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log(colors.error(`✗ Request timed out after 10 seconds`));
    } else {
      console.log(colors.error(`✗ Failed to fetch metadata: ${error.message}`));
    }
    return {};
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    printHelp();
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const rawType = args._positional?.[0] ?? args.type ?? args.t;
  const resolvedType = normalizeType(rawType);

  if (!resolvedType) {
    console.log(colors.warn("No type supplied — launching interactive mode."));
  }

  const type = resolvedType ?? (await askForType());
  const config = TYPE_CONFIG[type];

  const answersFromArgs = collectAnswersFromArgs(args);

  if (type === "bookmarks" && args._positional?.[1] && !answersFromArgs.url) {
    const secondArg = args._positional[1];
    if (secondArg.startsWith("http://") || secondArg.startsWith("https://")) {
      answersFromArgs.url = secondArg;
    }
  }

  let fetchedMetadata = {};
  if (type === "bookmarks" && answersFromArgs.url && args.fetch !== false) {
    fetchedMetadata = await fetchMetadata(answersFromArgs.url);
  }

  const mergedArgsWithFetch = { ...fetchedMetadata, ...answersFromArgs };
  const needsPrompts = Boolean(args.interactive);

  let interactiveAnswers = {};
  if (needsPrompts) {
    console.log(colors.info(`\n${ANSI.bold}Interactive ${config.label} setup${ANSI.reset}`));
    interactiveAnswers = await promptForMissingFields(config, mergedArgsWithFetch, Boolean(args.interactive));
  }

  const mergedAnswers = { ...mergedArgsWithFetch, ...interactiveAnswers };
  const finalAnswers = fillWithDefaults(type, mergedAnswers, today);
  validateRequired(config, finalAnswers);

  if (type === "pages" && finalAnswers.path) {
    finalAnswers.path = normalizePath(finalAnswers.path);
  }

  let slugSource = config.slugSource ? config.slugSource(finalAnswers) : finalAnswers.slug;

  if (type === "bookmarks" && slugSource === "TODO" && finalAnswers.url) {
    try {
      const urlObj = new URL(finalAnswers.url);
      const domain = urlObj.hostname.replace(/^www\./, "");
      const pathParts = urlObj.pathname.split("/").filter((p) => p && p !== "index.html" && p !== "index.htm");

      if (pathParts.length > 0) {
        const lastSegment = pathParts[pathParts.length - 1].replace(/\.[^.]*$/, "");
        slugSource = `${domain.split(".")[0]}-${lastSegment}`;
      } else {
        slugSource = domain.replace(/\./g, "-");
      }
    } catch {}
  }

  const slug = slugSource ? slugify(slugSource) || `entry-${Date.now()}` : undefined;
  const filePath = config.getFilePath({ answers: finalAnswers, slug, date: today });

  const frontmatterLines = buildFrontmatter(type, finalAnswers, today);
  const suppliedBody = typeof finalAnswers.body === "string" ? finalAnswers.body : "";

  let body;
  if (type === "bookmarks" && fetchedMetadata.description && !suppliedBody.trim()) {
    body = fetchedMetadata.description;
  } else {
    body = suppliedBody.trim().length > 0 ? suppliedBody : config.placeholder;
  }
  const frontmatterBlock = frontmatterLines.length ? `---\n${frontmatterLines.join("\n")}\n---\n\n` : "";
  const bodyBlock = body ? `${body}\n` : "";
  const content = `${frontmatterBlock}${bodyBlock}`;

  if (args.dryRun) {
    console.log(colors.warn(`\n[Dry Run] ${config.label} would be created at ${relative(ROOT, filePath)}`));
    console.log("");
    console.log(content);
    console.log("");
    return;
  }

  await ensureDirectory(filePath);
  await ensureWritable(filePath, args.force);
  await fs.writeFile(filePath, content, "utf8");

  console.log(colors.success(`\n${config.label} created at ${relative(ROOT, filePath)}`));
}

function parseArgs(argv) {
  const result = { _positional: [] };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      result._positional.push(token);
      continue;
    }

    const [rawKey, inlineVal] = token.slice(2).split("=");
    const key = toCamel(rawKey);
    if (inlineVal !== undefined) {
      result[key] = coerceValue(key, inlineVal);
      continue;
    }

    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      result[key] = coerceValue(key, true);
      continue;
    }

    result[key] = coerceValue(key, next);
    i += 1;
  }

  return result;
}

function toCamel(flag) {
  return flag.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
}

function coerceValue(key, value) {
  if (ARG_BOOLEAN_FLAGS.has(key)) {
    if (typeof value === "boolean") return value;
    const lowered = value.toString().toLowerCase();
    if (["false", "0", "no", "off"].includes(lowered)) return false;
    if (["true", "1", "yes", "on"].includes(lowered)) return true;
    return Boolean(value);
  }

  if (ARG_NUMBER_FLAGS.has(key)) {
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }

  if (ARG_ARRAY_FLAGS.has(key)) {
    return splitList(value);
  }

  return value;
}

function splitList(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeType(type) {
  if (!type) return undefined;
  const lowered = type.toLowerCase();
  if (["blog", "post", "posts"].includes(lowered)) return "blog";
  if (["bookmark", "bookmarks"].includes(lowered)) return "bookmarks";
  if (["page", "pages"].includes(lowered)) return "pages";
  return undefined;
}

async function askForType() {
  const { type } = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "What would you like to create?",
      choices: [
        { name: "Blog Post", value: "blog" },
        { name: "Bookmark", value: "bookmarks" },
        { name: "Page", value: "pages" },
      ],
    },
  ]);
  return type;
}

function collectAnswersFromArgs(args) {
  const base = { ...args };
  delete base._positional;
  delete base.type;
  delete base.t;
  delete base.interactive;
  delete base.force;
  delete base.dryRun;
  delete base.fetch;
  return base;
}

async function promptForMissingFields(config, initial, promptAll = false) {
  const questions = config.fields
    .filter((field) => promptAll || !hasValue(initial[field.name]))
    .map((field) => {
      const question = {
        name: field.name,
        message: field.message,
        default: initial[field.name],
        type: field.type ?? "input",
      };

      if (field.when) {
        question.when = (answers) => field.when({ ...initial, ...answers });
      }

      if (field.filter) {
        question.filter = field.filter;
      }

      if (field.choices) {
        question.choices = field.choices;
      }

      return question;
    });

  if (questions.length === 0) {
    return {};
  }

  return inquirer.prompt(questions);
}

function validateRequired(config, answers) {
  const missing = config.fields
    .filter((field) => field.required && !hasValue(answers[field.name]))
    .map((field) => field.message);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
}

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function ensureDirectory(filePath) {
  const dir = dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function ensureWritable(filePath, force) {
  try {
    await fs.access(filePath);
    if (!force) {
      throw new Error(`File already exists at ${relative(ROOT, filePath)}. Use --force to overwrite.`);
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
}

function buildFrontmatter(type, answers, today) {
  const frontmatter = [];
  const pushLine = (key, value) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    if (Array.isArray(value)) {
      frontmatter.push(`${key}: ${formatArray(value)}`);
      return;
    }
    if (typeof value === "string") {
      const shouldQuote = !/^\d{4}-\d{2}-\d{2}$/.test(value);
      const safe = value.replace(/"/g, '\\"');
      frontmatter.push(`${key}: ${shouldQuote ? `"${safe}"` : safe}`);
      return;
    }
    frontmatter.push(`${key}: ${value}`);
  };

  if (type === "blog") {
    pushLine("title", answers.title);
    pushLine("description", answers.description);
    pushLine("date", answers.date ?? today);
    pushLine("tags", answers.tags ?? []);
    pushLine("draft", Boolean(answers.draft));
  } else if (type === "bookmarks") {
    pushLine("title", answers.title);
    pushLine("url", answers.url);
    pushLine("date", answers.date ?? today);
    pushLine("categories", answers.categories ?? []);
  } else if (type === "pages") {
    pushLine("title", answers.title);
    pushLine("description", answers.description);
    pushLine("path", answers.path);
    pushLine("showInNav", Boolean(answers.showInNav));
    if (answers.navLabel) {
      pushLine("navLabel", answers.navLabel);
    }
    if (typeof answers.navOrder === "number" && !Number.isNaN(answers.navOrder)) {
      pushLine("navOrder", Number(answers.navOrder));
    }
    if (answers.ogImage) {
      pushLine("ogImage", answers.ogImage);
    }
  }

  return frontmatter;
}

function formatArray(items) {
  if (!items || items.length === 0) return "[]";
  const escaped = items.map((item) => `"${String(item).replace(/"/g, '\\"')}"`);
  return `[${escaped.join(", ")}]`;
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function fillWithDefaults(type, answers, today) {
  const defaults = placeholderDataFor(type, today);
  const result = { ...defaults, ...answers };
  return result;
}

function normalizePath(pathValue) {
  if (!pathValue) return "/";
  const trimmed = pathValue.trim();
  if (!trimmed) return "/";
  if (trimmed === "/") return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function placeholderDataFor(type, today) {
  if (type === "blog") {
    return { title: "TODO", description: "TODO", date: today, tags: [], draft: true };
  }

  if (type === "bookmarks") {
    return { title: "TODO", url: "https://example.com", date: today, categories: [] };
  }

  if (type === "pages") {
    return {
      title: "TODO",
      description: "TODO",
      path: "/todo",
      showInNav: false,
      navLabel: undefined,
      navOrder: undefined,
    };
  }

  return {};
}

function printHelp() {
  console.log(colors.title("create.js — content helper\n"));
  console.log(`${colors.info("Usage:")} node scripts/create.js [post|bookmark|page] [options]`);
  console.log(`       node scripts/create.js bookmark <url> [options]`);
  console.log(`       node scripts/create.js --type <post|bookmark|page> [options]\n`);

  const groups = [
    {
      header: "General Options",
      color: colors.info,
      options: [
        ["--type <post|bookmark|page>", "Type of entry to create"],
        ["--interactive", "Force interactive prompts"],
        ["--help", "Show this help"],
      ],
    },
    {
      header: "Content Options",
      color: colors.success,
      options: [
        ['--title "..."', "Entry title (defaults to 'TODO')"],
        ['--description "..."', "Description for posts/pages (defaults to 'TODO')"],
        ['--body "Content"', "Body content (defaults to placeholder text)"],
        ["--slug custom-slug", "Override generated slug (auto-generated from title)"],
      ],
    },
    {
      header: "Blog Options",
      color: colors.warn,
      options: [
        ["--tags a,b,c", "Tags for posts (defaults to empty array)"],
        ["--draft", "Mark blog post as draft (defaults to true)"],
      ],
    },
    {
      header: "Bookmark Options",
      color: colors.warn,
      options: [
        ["--url <url>", "Bookmark URL (auto-fetches metadata when provided)"],
        ["--categories a,b,c", "Categories for bookmarks (defaults to empty array)"],
      ],
    },
    {
      header: "Page Options",
      color: colors.warn,
      options: [
        ["--path /slug", "Route for pages (defaults to '/todo')"],
        ["--show-in-nav", "Include page in nav (defaults to false)"],
        ['--nav-label "Label"', "Label for nav entry (optional)"],
        ["--nav-order <number>", "Navigation order (optional)"],
        ["--og-image path", "OG image path (optional)"],
      ],
    },
    {
      header: "Output Options",
      color: colors.info,
      options: [
        ["--force", "Overwrite existing file"],
        ["--dry-run", "Print file without writing"],
      ],
    },
  ];

  const allOptions = groups.flatMap((group) => group.options);
  const maxFlagWidth = Math.max(...allOptions.map(([flag]) => flag.length));

  groups.forEach((group, index) => {
    if (index > 0) console.log("");
    console.log(group.color(group.header));

    group.options.forEach(([flag, desc]) => {
      const padding = " ".repeat(maxFlagWidth - flag.length + 2);
      console.log(`  ${flag}${padding}${desc}`);
    });
  });

  console.log("");
}

main().catch((err) => {
  console.error(colors.error(`\n${err.message}`));
  process.exitCode = 1;
});
