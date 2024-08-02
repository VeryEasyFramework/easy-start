
import { runCommand } from "@eveffer/easy-command";

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

async function cloneRepo() {
  return await git(
    "clone",
    "git@github.com:eveffer/easy-app-template.git",
    "./easy-app",
  );
}

async function deleteGitFolder() {
  return await runCommand("rm", { args: ["-rf", ".git"], cwd: "./easy-app" });
}

async function initGit() {
  return await runCommand("git", { args: ["init"], cwd: "./easy-app" });
}

async function initClient() {
  return await runCommand(Deno.execPath(), {
    args: [
      "cache",
      "--node-modules-dir",
      "--allow-scripts=npm:esbuild",
      "vite.config.mts",
    ],
    cwd: "./easy-app/client",
  });
}

async function initDeno() {
  return await runCommand(Deno.execPath(), {
    args: ["cache", "app.ts"],
    cwd: "./easy-app",
  });
}
async function runDev() {
  return await runCommand(Deno.execPath(), {
    args: ["task", "dev"],
    cwd: "./easy-app",
  });
}
if (import.meta.main) {
  await cloneRepo();
  await deleteGitFolder();
  await initClient();
  await initDeno();
  await runDev();
}
