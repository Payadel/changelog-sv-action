import * as core from "@actions/core";
import { isVersionValid } from "./version";
import { getBooleanInput } from "@actions/core";

export interface IInputs {
    version: string;
    ignoreSameVersionError: boolean;
    ignoreLessVersionError: boolean;
    changelogVersionRegex: RegExp;
}

export const getInputs = (): Promise<IInputs> =>
    new Promise<IInputs>(resolve => {
        const version = getInputOrDefault("version", "", true, false);
        if (version && !isVersionValid(version))
            throw new Error("The input version is not valid.");

        const ignoreSameVersionError = getBooleanInput(
            "ignore-same-version-error"
        );
        const ignoreLessVersionError = getBooleanInput(
            "ignore-less-version-error"
        );

        const changelogVersionRegexStr = getInputOrDefault(
            "changelog-version-regex",
            "[#]+[ ]+((\\[[^\\]]+\\]\\([^)]+\\))|[^ ]+)[ ]+\\([^)]+\\)",
            true,
            false
        );
        const changelogVersionRegex = new RegExp(changelogVersionRegexStr);

        return resolve({
            version,
            ignoreSameVersionError,
            ignoreLessVersionError,
            changelogVersionRegex,
        });
    });

function getInputOrDefault(
    name: string,
    default_value = "",
    trimWhitespace = false,
    required = false
): string {
    const input = core.getInput(name, {
        trimWhitespace,
        required,
    });
    if (!input || input === "") return default_value;
    return input;
}
