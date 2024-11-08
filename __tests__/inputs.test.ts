import * as core from "@actions/core";
import { getInputs, IInputs } from "../src/inputs";

jest.mock("@actions/core");

export function mockGetInput(
    name: string,
    inputs: { key: string; value: string }[],
    options?: core.InputOptions | undefined
) {
    name = name.toLowerCase();
    const target = inputs.find(input => input.key.toLowerCase() === name);
    let result = target ? target.value : "";

    if (options && options.required && !result)
        throw new Error(`Input required and not supplied: ${name}`);
    if (options && options.trimWhitespace) result = result.trim();
    return result;
}

async function assertValidVersion(inputVersion: string): Promise<void> {
    jest.spyOn(core, "getInput").mockImplementation(
        (name: string, options?: core.InputOptions | undefined) =>
            mockGetInput(
                name,
                [{ key: "version", value: inputVersion }],
                options
            )
    );
    const inputs = await getInputs();
    expect(inputs.version).toBe(inputVersion);
}

describe("version", () => {
    it("give valid input, should return version", async () => {
        await assertValidVersion(""); // Empty is valid
        await assertValidVersion("1");
        await assertValidVersion("1.0");
        await assertValidVersion("1.0.0");
        await assertValidVersion("1.2-alpha");
        await assertValidVersion("1.2.3-beta.4");
        await assertValidVersion("1.0.0-rc.1.2");
    });

    it("give invalid input, should reject promise", async () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    [{ key: "version", value: "invalid" }],
                    options
                )
        );
        await expect(getInputs()).rejects.toThrow(
            "The input version is not valid."
        );
    });

    it("Input version must be trim", async () => {
        const version = "1.2-alpha";
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    [{ key: "version", value: `    ${version}    ` }],
                    options
                )
        );

        const inputs: IInputs = await getInputs();

        expect(inputs.version).toBe(version);
    });
});

describe("changelogVersionRegex", () => {
    it("give valid regex string, should return regex", async () => {
        const changelogVersionRegex = "[0-9]+";
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    [
                        {
                            key: "changelog-version-regex",
                            value: changelogVersionRegex
                        }
                    ],
                    options
                )
        );
        const inputs = await getInputs();
        expect(inputs.changelogVersionRegex.toString()).toBe(
            `/${changelogVersionRegex}/`
        );
    });

    it("give invalid regex, should reject promise", async () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    [
                        {
                            key: "changelog-version-regex",
                            value: "[0-9+"
                        }
                    ],
                    options
                )
        );
        await expect(getInputs()).rejects.toThrow(
            "Invalid regular expression: /[0-9+/: Unterminated character class"
        );
    });

    it("Input regex must be trim", async () => {
        const changelogVersionRegex = "[0-9]+";
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    [
                        {
                            key: "changelog-version-regex",
                            value: `    ${changelogVersionRegex}     `
                        }
                    ],
                    options
                )
        );

        const inputs: IInputs = await getInputs();

        expect(inputs.changelogVersionRegex.toString()).toBe(
            `/${changelogVersionRegex}/`
        );
    });
});
