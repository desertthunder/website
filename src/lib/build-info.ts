import { execSync } from "node:child_process";
import pkg from "../../package.json";

export type BuildInfo = {
  repo: string;
  version: string;
  commitHash: string;
  shortCommitHash: string;
  buildTime: string;
};

function readGitValue(command: string) {
  try {
    return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return undefined;
  }
}

export function getBuildInfo(): BuildInfo {
  const envCommitHash = process.env.CF_PAGES_COMMIT_SHA || process.env.COMMIT_SHA || process.env.GITHUB_SHA;
  const commitHash = envCommitHash || readGitValue("git rev-parse HEAD") || "unknown";
  const shortCommitHash = commitHash === "unknown" ? "unknown" : commitHash.slice(0, 7);
  return {
    repo: pkg.repository.url,
    version: pkg.version,
    commitHash,
    shortCommitHash,
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
  };
}
