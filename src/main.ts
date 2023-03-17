import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as fs from "fs";

const CHANGELOG_FILE_NAME = "CHANGELOG.md";

async function main(): Promise<void> {
    const inputVersion = core.getInput("version")
    if (inputVersion) {
        let execResult = await exec.getExecOutput(`standard-version --skip.changelog --skip.tag --skip.commit --release-as ${inputVersion}`);
        if (execResult.exitCode !== 0) {
            core.setFailed(`Run release-as failed: ${execResult.stderr}`);
            return;
        }
    }

    let command = "standard-version --skip.tag --skip.commit"
    if (inputVersion)
        command += " --skip.bump"

    try {
        await exec.getExecOutput(command)
            .then(() => exec.getExecOutput(`git add ${CHANGELOG_FILE_NAME}`))
            .then(() => exec.getExecOutput("git checkout -- package.json"))
            .then(() => getVersion(inputVersion)
                .then(version => core.setOutput("version", version)))
            .then(() => core.setOutput("changelog", fs.readFileSync(CHANGELOG_FILE_NAME, "utf8")));
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

function getVersion(version) {
    return new Promise((resolve, reject) => {
        if (version) {
            resolve(version);
            return;
        }

        return exec.getExecOutput("node -p -e \"require('./package.json').version\"")
            .then(result => result.stdout.trim())
            .catch(reject);
    })
}

main();
