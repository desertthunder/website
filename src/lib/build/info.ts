import { execFileSync } from "node:child_process";
import pkg from "../../../package.json";

export type BuildInfo = {
  repo: string;
  version: string;
  displayVersion: string;
  commitHash: string;
  shortCommitHash: string;
  buildTime: string;
};

function readGitValue(args: string[]) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return undefined;
  }
}

function getVersionTag(versionTag: string) {
  const verifiedTag = readGitValue(["rev-parse", "--verify", versionTag]);
  if (!verifiedTag) return versionTag;
  return readGitValue(["describe", "--tags", "--abbrev=0", "--match", "v[0-9]*"]);
}

export function getBuildInfo(): BuildInfo {
  const envCommitHash = process.env.CF_PAGES_COMMIT_SHA || process.env.COMMIT_SHA || process.env.GITHUB_SHA;
  const commitHash = envCommitHash || readGitValue(["rev-parse", "HEAD"]) || "unknown";
  const shortCommitHash =
    process.env.CF_PAGES_COMMIT_SHA || process.env.COMMIT_SHA || process.env.GITHUB_SHA
      ? commitHash.slice(0, 7)
      : readGitValue(["rev-parse", "--short", "HEAD"]) || "unknown";
  const versionTag = `v${pkg.version}`;
  const tag = getVersionTag(versionTag);
  const commitCount =
    readGitValue(tag ? ["rev-list", "--count", `${tag}..HEAD`] : ["rev-list", "--count", "HEAD"]) ?? "0";
  const displayVersion = commitCount === "0" ? versionTag : `${versionTag}-${commitCount}+g${shortCommitHash}`;

  return {
    repo: pkg.repository.url,
    version: pkg.version,
    displayVersion,
    commitHash,
    shortCommitHash,
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
  };
}
