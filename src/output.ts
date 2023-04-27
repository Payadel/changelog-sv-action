import { readVersion } from "./version";
import { readChangelogSection } from "./utility";
import * as core from "@actions/core";

export interface IOutput {
    version: string;
    changelog: string;
}

export function getOutputData(
    package_json_path: string,
    changelog_file: string,
    changelogVersionRegex: RegExp
): Promise<IOutput> {
    return new Promise<IOutput>(() =>
        readVersion(package_json_path).then(latestVersion =>
            readChangelogSection(
                changelog_file,
                latestVersion,
                changelogVersionRegex
            ).then(changelog => ({ version: latestVersion, changelog }))
        )
    );
}

export function setOutputs(data: IOutput): void {
    core.setOutput("version", data.version);
    core.setOutput("changelog", data.changelog);
}
