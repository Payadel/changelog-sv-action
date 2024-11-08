import { readVersion } from "./version";
import { readChangelogSection } from "./utility";
import * as core from "@actions/core";

export interface IOutput {
    version: string;
    changelog: string;
}

export async function getOutputData(
    package_json_path: string,
    changelog_file: string,
    changelogVersionRegex: RegExp
): Promise<IOutput> {
    const latestVersion = await readVersion(package_json_path);
    const changelog = await readChangelogSection(
        changelog_file,
        latestVersion,
        changelogVersionRegex
    );
    return { version: latestVersion, changelog };
}

export function setOutputs(data: IOutput): void {
    core.setOutput("version", data.version);
    core.setOutput("changelog", data.changelog);
}
