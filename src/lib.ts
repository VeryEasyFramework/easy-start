import { runCommand } from "@vef/easy-command";
import { ColorMe, colorMe } from "@vef/color-me";

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
    hideOutput: true,
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
    hideOutput: true,
    args: ["-rf", ".git"],
    cwd: "./easy-app",
  });
  return result.success;
}

async function initDeno(): Promise<boolean> {
  const result = await runCommand(Deno.execPath(), {
    hideOutput: true,
    args: ["task", "cache"],
    cwd: "./easy-app",
  });
  return result.success;
}

async function renameFile(appName: string, path: string): Promise<void> {
  const matchString = "{appName}";
  const content = await Deno.readTextFile(path);
  const newContent = content.replace(matchString, appName);
  await Deno.writeTextFile(path, newContent);
}

async function successWrapper(fn: () => Promise<boolean|undefined>, message: string) {
  console.log(colorMe.brightCyan(message));
  if (!await fn()) {
    console.error(`Failed to ${message}`);
    Deno.exit(1);
  }
}
async function renameFiles() {
  const files = [
    "./easy-app/README.md",
    "./easy-app/client/index.html",
    "./easy-app/client/src/App.vue",
  ];

  for (const file of files) {
    try{
      
    await renameFile("My Awesome App", file);
    }catch(e){
      console.log('...')
      return true;
    }
  return true;
  }
}
export async function setUpEasyApp() {
  await successWrapper(cloneRepo, "Fetching the easy-app template...");
  await successWrapper(deleteGitFolder, "Setting up the project...");

  await successWrapper(renameFiles, "Cleaning up the project...");

    await successWrapper(initDeno, "Loading dependencies...");
  console.log(
    colorMe.brightGreen(
      "Project setup complete! 🚀 Run: \n\n",
    ),
  );
  console.log(
    colorMe.brightGreen(
      "code easy-app\n",
    ),
  );
}
