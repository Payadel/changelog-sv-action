import * as core from "@actions/core";
import { isVersionValid } from "./version";

export interface IInputs {
    version: string;
}

export const getInputs = (): Promise<IInputs> =>
    new Promise<IInputs>(resolve => {
        const version = getInputOrDefault("version", "", true, false);
        if (version && !isVersionValid(version))
            throw new Error("The input version is not valid.");

        return resolve({
            version,
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
