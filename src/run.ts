import * as core from "@actions/core";
import { getInputs } from "./inputs";
import * as exec from "@actions/exec";
import { compareVersions, readVersion } from "./version";
import { execCommand } from "./utility";
import { getOutputData, setOutputs } from "./output";

const run = (
    package_json_path: string,
    changelog_filename: string
): Promise<void> =>
    mainProcess(package_json_path, changelog_filename)
        .then(() => core.info("Operation completed successfully."))
        .catch(error => {
            core.error("Operation failed.");
            core.setFailed(
                error instanceof Error ? error.message : error.toString()
            );
        });

export default run;

function mainProcess(
    package_json_path: string,
    changelog_filename: string
): Promise<void> {
    return getInputs().then(inputs => {
        return installStandardVersion().then(() =>
            updateVersion(
                inputs.version,
                package_json_path,
                inputs.ignoreSameVersionError,
                inputs.ignoreLessVersionError
            )
                .then(() => createChangelog(inputs.version))
                .then(() => updateGitChanges(changelog_filename))
                .then(() =>
                    getOutputData(
                        package_json_path,
                        changelog_filename,
                        inputs.changelogVersionRegex
                    )
                )
                .then(setOutputs)
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
    package_json_path,
    ignoreSameVersionError: boolean,
    ignoreLessVersionError: boolean
): Promise<void> {
    return new Promise<void>(() => {
        if (!inputVersion) return;

        return readVersion(package_json_path).then(prevVersion => {
            if (
                !ignoreSameVersionError &&
                prevVersion.toLowerCase() === inputVersion.toLowerCase()
            ) {
                throw new Error(
                    `The input version '${inputVersion}' is equal to the previously version '${prevVersion}'.\n` +
                        "If you want, you can set ignore-same-version-error to ignore this error."
                );
            }
            if (
                !ignoreLessVersionError &&
                compareVersions(inputVersion, prevVersion) === -1
            ) {
                throw new Error(
                    `The input version '${inputVersion}' is less than previously version '${prevVersion}'.\n` +
                        "If you want, you can set ignore-less-version-error to ignore this error."
                );
            }

            core.info(`set version to ${inputVersion}`);
            return execCommand(
                `standard-version --skip.changelog --skip.tag --skip.commit --release-as ${inputVersion}`,
                `Update version to requested version (${inputVersion}) failed.`
            );
        });
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
        execCommand("git checkout .")
    );
}
