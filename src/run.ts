import * as core from "@actions/core";
import { getInputs } from "./inputs";
import * as exec from "@actions/exec";
import { execCommand, readFile, readVersion } from "./utility";

const run = (): Promise<void> =>
    mainProcess()
        .then(() => core.info("Operation completed successfully."))
        .catch(error => {
            core.error("Operation failed.");
            core.setFailed(
                error instanceof Error ? error.message : error.toString()
            );
        });

export default run;

function mainProcess(): Promise<void> {
    return getInputs().then(inputs => {
        return installStandardVersion()
            .then(() => updateVersion(inputs.version))
            .then(() => createChangelog(inputs.version))
            .then(() => updateGitChanges())
            .then(() => setOutputs());
    });
}

function installStandardVersion(): Promise<exec.ExecOutput> {
    return execCommand(
        "npm install -g standard-version",
        "Install standard-version npm package failed."
    );
}

function updateVersion(inputVersion: string): Promise<void> {
    return new Promise<void>(resolve => {
        if (!inputVersion) return resolve();

        core.info(`set version to ${inputVersion}`);
        return execCommand(
            `standard-version --skip.changelog --skip.tag --skip.commit --release-as ${inputVersion}`,
            `Update version to requested version (${inputVersion}) failed.`
        );
    });
}

function createChangelog(inputVersion: string): Promise<exec.ExecOutput> {
    return new Promise<string>(resolve => {
        let changelogCommand = "standard-version --skip.tag --skip.commit";
        if (inputVersion) changelogCommand += " --skip.bump";
        return resolve(changelogCommand);
    }).then(changelogCommand =>
        execCommand(changelogCommand, "Create changelog failed.")
    );
}

function updateGitChanges(): Promise<exec.ExecOutput> {
    return execCommand(`git add CHANGELOG.md`).then(() =>
        execCommand("git checkout -- package.json package-lock.json")
    );
}

function setOutputs(): Promise<void> {
    return readVersion()
        .then(version => core.setOutput("version", version))
        .then(() =>
            readFile("changelog.md").then(content =>
                core.setOutput("changelog", content)
            )
        );
}
