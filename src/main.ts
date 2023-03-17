import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as fs from "fs";

const CHANGELOG_FILE_NAME = "CHANGELOG.md";

async function main(): Promise<void> {
  const inputVersion = core.getInput("version");
  core.info(`Input version: ${inputVersion}`);

  // If specific version is requested, update version:
  if (inputVersion) {
    let execOutput = await updateVersion(inputVersion);
    if (execOutput.exitCode !== 0) {
      core.setFailed(
        `Update version to requested version failed: ${execOutput.stderr}`
      );
      return;
    }
  }

  let changelogCommand = "standard-version --skip.tag --skip.commit";
  if (inputVersion) changelogCommand += " --skip.bump";

  try {
    await exec
      .getExecOutput(changelogCommand)
      .then(() => exec.getExecOutput(`git add ${CHANGELOG_FILE_NAME}`))
      // The version must not be changed until release.
      .then(() => exec.getExecOutput("git checkout -- package.json"))
      //set output 'version'
      .then(() =>
        getVersion(inputVersion).then(version =>
          core.setOutput("version", version)
        )
      )
      //set output 'changelog'
      .then(() =>
        core.setOutput(
          "changelog",
          fs.readFileSync(CHANGELOG_FILE_NAME, "utf8")
        )
      );
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

function updateVersion(version: string): Promise<exec.ExecOutput> {
  return exec.getExecOutput(
    `standard-version --skip.changelog --skip.tag --skip.commit --release-as ${version}`
  );
}

async function getVersion(version: string): Promise<string> {
  if (version) return version;

  return await exec
    .getExecOutput("node -p -e \"require('./package.json').version\"")
    .then(result => result.stdout.trim());
}

main();
