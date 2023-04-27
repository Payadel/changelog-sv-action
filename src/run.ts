import * as core from "@actions/core";
import { getInputs } from "./inputs";
import * as exec from "@actions/exec";
import { compareVersions, execCommand, readFile, readVersion } from "./utility";

const CHANGELOG_FILE_NAME = "CHANGELOG.md";

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
            .then(() => readVersion("./package.json"))
            .then(prevVersion =>
                updateVersion(
                    inputs.version,
                    prevVersion,
                    inputs.ignoreSameVersionError,
                    inputs.ignoreLessVersionError
                )
                    .then(() => createChangelog(inputs.version))
                    .then(() => updateGitChanges(CHANGELOG_FILE_NAME))
                    .then(() => setOutputs(CHANGELOG_FILE_NAME))
            );
    });
}

function installStandardVersion(): Promise<exec.ExecOutput> {
    return execCommand(
        "npm install -g standard-version",
        "Install standard-version npm package failed."
    );
}

function updateVersion(
    inputVersion: string,
    prevVersion: string,
    ignoreSameVersionError: boolean,
    ignoreLessVersionError: boolean
): Promise<void> {
    return new Promise<void>(() => {
        if (!inputVersion) return;
        if (
            !ignoreSameVersionError &&
            prevVersion.toLowerCase() === inputVersion.toLowerCase()
        ) {
            throw new Error(
                `The input version '${inputVersion}' is equal to the previously version '${prevVersion}'.`
            );
        }
        if (
            !ignoreLessVersionError &&
            compareVersions(inputVersion, prevVersion) === -1
        ) {
            throw new Error(
                `The input version '${inputVersion}' is less than previously version '${prevVersion}'.`
            );
        }

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

function updateGitChanges(
    changelog_fileName: string
): Promise<exec.ExecOutput> {
    return execCommand(`git add ${changelog_fileName}`).then(() =>
        execCommand("git checkout -- package.json package-lock.json")
    );
}

function setOutputs(changelog_fileName: string): Promise<void> {
    return readVersion("./package.json")
        .then(version => core.setOutput("version", version))
        .then(() =>
            readFile(changelog_fileName).then(content =>
                core.setOutput("changelog", content)
            )
        );
}
