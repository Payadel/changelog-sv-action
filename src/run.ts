import * as core from "@actions/core";
import { getInputs } from "./inputs";
import * as exec from "@actions/exec";
import { compareVersions, readVersion } from "./version";
import { execCommand } from "./utility";
import { getOutputData, IOutput, setOutputs } from "./output";

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

async function mainProcess(
    package_json_path: string,
    changelog_filename: string
): Promise<void> {
    const inputs = await getInputs();

    await installStandardVersion();

    await updateVersion(
        inputs.version,
        package_json_path,
        inputs.ignoreSameVersionError,
        inputs.ignoreLessVersionError
    );

    await createChangelog(inputs.version);

    const data: IOutput = await getOutputData(
        package_json_path,
        changelog_filename,
        inputs.changelogVersionRegex
    );
    setOutputs(data);

    await updateGitChanges(changelog_filename);
    return await Promise.resolve();
}

function installStandardVersion(): Promise<exec.ExecOutput> {
    return execCommand(
        "npm install -g standard-version",
        "Install standard-version npm package failed."
    );
}

function updateVersion(
    inputVersion: string,
    package_json_path: string,
    ignoreSameVersionError: boolean,
    ignoreLessVersionError: boolean
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (!inputVersion) return resolve();

        return readVersion(package_json_path)
            .then(prevVersion => {
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
            })
            .then(() => resolve())
            .catch(reject);
    });
}

async function createChangelog(inputVersion: string): Promise<exec.ExecOutput> {
    let changelogCommand = "standard-version --skip.tag --skip.commit";
    if (inputVersion) changelogCommand += " --skip.bump";

    return await execCommand(changelogCommand, "Create changelog failed.");
}

async function updateGitChanges(
    changelog_fileName: string
): Promise<exec.ExecOutput> {
    await execCommand(`git add ${changelog_fileName}`);
    return await execCommand("git checkout .");
}
