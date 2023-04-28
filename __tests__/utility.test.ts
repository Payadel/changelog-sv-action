import { execCommand, readChangelogSection, readFile } from "../src/utility";
import fs, { mkdtempSync, writeFileSync } from "fs";
import { join } from "path";
import path from "path";
import { DEFAULT_CHANGELOG_VERSION_REGEX } from "../src/configs";

describe("execCommand", () => {
    test("should execute command successfully", async () => {
        const output = await execCommand('echo "Hello World"');
        expect(output.stdout.trim()).toBe("Hello World");
        expect(output.stderr).toBeFalsy();
        expect(output.exitCode).toBe(0);
    });

    test("should throw an error when the command fails", async () => {
        await expect(execCommand("invalid-command")).rejects.toThrow(
            new RegExp("Execute 'invalid-command' failed.")
        );
    });

    test("should throw an error with custom error message when provided", async () => {
        const customMessage = "Custom error message";
        await expect(
            execCommand("invalid-command", customMessage)
        ).rejects.toThrow(new RegExp(customMessage));
    });
});

describe("readFile", () => {
    let tempDir: string;
    let filePath: string;
    const content = "sample content";

    beforeEach(() => {
        // Create a unique temporary directory with a random name
        tempDir = mkdtempSync("/tmp/test-");

        // Write a package.json file to the temporary directory
        filePath = join(tempDir, "file.txt");
        writeFileSync(filePath, `    ${content}   `);
    });

    afterEach(() => {
        // Delete the temporary directory
        fs.rmSync(tempDir, { recursive: true });
    });

    test("should read file and return text with trim", async () => {
        const content = await readFile(filePath);
        expect(content).toBe(content);
    });

    test("give invalid path, should throw error", async () => {
        await expect(readFile("invalid path")).rejects.toThrow(
            "Can not find 'invalid path'."
        );
    });
});

describe("readChangelogSection", () => {
    let tempDir;
    let changelogFile;

    beforeEach(async () => {
        // Create temp directory and changelog file
        tempDir = fs.mkdtempSync("/tmp/");
        changelogFile = path.join(tempDir, "CHANGELOG.md");
        const changelogData = `# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.3](https://github.com/Payadel/changelog-sv-action/compare/v0.0.2...v0.0.3) (2023-04-27)

### Features

* add \`ignore-same-version-error\` input to ignore same version error ([22898f7](https://github.com/Payadel/changelog-sv-action/commit/22898f7a4466db581497f8d832ebcbae47a53b6c))


### Development: CI/CD, Build, etc

* **deps:** bump Payadel/release-sv-action from 0.2.1 to 0.2.2 ([8f84614](https://github.com/Payadel/changelog-sv-action/commit/8f846147fab9213cff470114c234ce814206c204))

### 0.0.1 (2023-03-17)

### Features

* add base
  codes ([e20fe7c](https://github.com/Payadel/changelog-sv-action/commit/e20fe7c4a10eb59f821a4b83155b8702970fe871))
* try install the standard-version package in the first
  script ([9c931a8](https://github.com/Payadel/changelog-sv-action/commit/9c931a8a98ddc9d8e9653426074347f06ad7624c))

### Documents

* add Payadel readme
  template ([8b9a806](https://github.com/Payadel/changelog-sv-action/commit/8b9a806273d73b3aa90859cd42f7029d174a1474))
`;
        await fs.writeFileSync(changelogFile, changelogData);
    });

    afterEach(async () => {
        // Remove temp directory and files
        await fs.rmSync(tempDir, { recursive: true });
    });

    it("should read the changelog section 0.0.3", async () => {
        const version = "0.0.3";
        const expectedSection = `### [0.0.3](https://github.com/Payadel/changelog-sv-action/compare/v0.0.2...v0.0.3) (2023-04-27)

### Features

* add \`ignore-same-version-error\` input to ignore same version error ([22898f7](https://github.com/Payadel/changelog-sv-action/commit/22898f7a4466db581497f8d832ebcbae47a53b6c))


### Development: CI/CD, Build, etc

* **deps:** bump Payadel/release-sv-action from 0.2.1 to 0.2.2 ([8f84614](https://github.com/Payadel/changelog-sv-action/commit/8f846147fab9213cff470114c234ce814206c204))
`;

        const section = await readChangelogSection(
            changelogFile,
            version,
            new RegExp(DEFAULT_CHANGELOG_VERSION_REGEX)
        );

        expect(section).toBe(expectedSection);
    });

    it("should read the changelog section 0.0.1", async () => {
        const version = "0.0.1";
        const expectedSection = `### 0.0.1 (2023-03-17)

### Features

* add base
  codes ([e20fe7c](https://github.com/Payadel/changelog-sv-action/commit/e20fe7c4a10eb59f821a4b83155b8702970fe871))
* try install the standard-version package in the first
  script ([9c931a8](https://github.com/Payadel/changelog-sv-action/commit/9c931a8a98ddc9d8e9653426074347f06ad7624c))

### Documents

* add Payadel readme
  template ([8b9a806](https://github.com/Payadel/changelog-sv-action/commit/8b9a806273d73b3aa90859cd42f7029d174a1474))`;

        const section = await readChangelogSection(
            changelogFile,
            version,
            new RegExp(DEFAULT_CHANGELOG_VERSION_REGEX)
        );

        expect(section).toBe(expectedSection);
    });

    it("should throw an error if the changelog header cannot be found", async () => {
        const version = "2.0.0";
        const pattern = new RegExp(DEFAULT_CHANGELOG_VERSION_REGEX);

        await expect(
            readChangelogSection(changelogFile, version, pattern)
        ).rejects.toThrow(
            new RegExp(
                "Can not find or detect any changelog with version 2.0.0."
            )
        );
    });
});
