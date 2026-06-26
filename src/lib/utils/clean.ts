import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
  keepStartCensorStrategy,
  keepEndCensorStrategy,
  asteriskCensorStrategy,
} from "obscenity";

const matcher = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers });

const censor = new TextCensor().setStrategy(keepStartCensorStrategy(keepEndCensorStrategy(asteriskCensorStrategy())));

/** Censors profanity using obscenity. */
export function censorProfanity(input: string): string {
  const matches = matcher.getAllMatches(input, true);
  return censor.applyTo(input, matches);
}

/** Strip markdown links and formatting */
export function stripMarkdown(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#]/g, "")
    .trim();
}

/** Strip HTML tags and collapse whitespace */
export function stripHtml(html: string = ""): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** picks keys from an object */
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );
}
