import { runCommand } from "@vef/easy-command";

type GitCommand = "add" | "commit" | "push" | "pull" | "status";

type GitCliCommand = "clone" | "init" | "config" | "remote" | "branch";

function git(
  command: "clone",
  repository: string,
  path: string,
): Promise<boolean>;
function git(command: "init"): Promise<boolean>;
function git(command: "config", key: string, value: string): Promise<boolean>;

async function git(command: string, ...args: string[]): Promise<boolean> {
  const result = await runCommand("git", {
    args: [command, ...args],
  });

  return result.success;
}

async function cloneRepo(): Promise<boolean> {
  return await git(
    "clone",
    "https://github.com/VeryEasyFramework/easy-app-template.git",
    "./easy-app",
  );
}

async function deleteGitFolder(): Promise<boolean> {
  const result = await runCommand("rm", {
    args: ["-rf", ".git"],
    cwd: "./easy-app",
  });
  return result.success;
}

async function initGit(): Promise<boolean> {
  const result = await runCommand("git", { args: ["init"], cwd: "./easy-app" });
  return result.success;
}

async function initClient(): Promise<boolean> {
  const result = await runCommand(Deno.execPath(), {
    args: [
      "cache",
      "--node-modules-dir",
      "--allow-scripts=npm:esbuild",
      "vite.config.mts",
    ],
    cwd: "./easy-app/client",
  });
  return result.success;
}

async function initDeno(): Promise<boolean> {
  const result = await runCommand(Deno.execPath(), {
    args: ["cache", "app.ts"],
    cwd: "./easy-app",
  });
  return result.success;
}
async function runDev(): Promise<boolean> {
  const result = await runCommand(Deno.execPath(), {
    args: ["task", "dev"],
    cwd: "./easy-app",
  });
  return result.success;
}

async function successWrapper(fn: () => Promise<boolean>, message: string) {
  if (!await fn()) {
    console.error(`Failed to ${message}`);
    Deno.exit(1);
  }
}

export async function setUpEasyApp() {
  await successWrapper(cloneRepo, "clone repository");
  await successWrapper(deleteGitFolder, "delete .git folder");
  await successWrapper(initClient, "init client");
  await successWrapper(initDeno, "init deno");
  await runDev();
}
