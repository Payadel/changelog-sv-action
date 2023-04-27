import {
    execCommand,
    readVersion,
    readFile,
    compareVersions,
} from "../src/utility";
import fs, { mkdtempSync, writeFileSync } from "fs";
import { join } from "path";

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

describe("readVersion", () => {
    let tempDir: string;
    let packageJsonPath: string;

    beforeEach(() => {
        // Create a unique temporary directory with a random name
        tempDir = mkdtempSync("/tmp/test-");

        // Write a package.json file to the temporary directory
        packageJsonPath = join(tempDir, "package.json");
        const packageJson = { name: "test", version: "1.0.0" };
        writeFileSync(packageJsonPath, JSON.stringify(packageJson));
    });

    afterEach(() => {
        // Delete the temporary directory
        fs.rmSync(tempDir, { recursive: true });
    });

    test("should read version from package.json", async () => {
        const version = await readVersion(packageJsonPath);
        expect(version).toBe("1.0.0");
    });

    test("give invalid path, should throw error", async () => {
        await expect(readVersion("invalid path")).rejects.toThrow(
            "Can not find package.json in 'invalid path'"
        );
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

describe("compareVersions", () => {
    it("returns 0 when the versions are equal", () => {
        expect(compareVersions("1.2.3", "1.2.3")).toBe(0);
        expect(compareVersions("1", "1")).toBe(0);
        expect(compareVersions("0", "0")).toBe(0);
        expect(compareVersions("1.0", "1.0")).toBe(0);
        expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
        expect(compareVersions("1.0.0-alpha", "1.0.0-alpha")).toBe(0);
    });

    it("returns -1 when the first version is less than the second", () => {
        expect(compareVersions("1.2.3", "1.2.4")).toBe(-1);
        expect(compareVersions("1.2.3", "1.3.0")).toBe(-1);
        expect(compareVersions("1.2.3", "2.0.0")).toBe(-1);
        expect(compareVersions("0", "1")).toBe(-1);
        expect(compareVersions("0.0", "1")).toBe(-1);
        expect(compareVersions("0.0.0-beta", "1")).toBe(-1);
        expect(compareVersions("0.10.10", "1")).toBe(-1);
        expect(compareVersions("1", "1.1")).toBe(-1);
        expect(compareVersions("1", "1.0.1")).toBe(-1);
    });

    it("returns 1 when the first version is greater than the second", () => {
        expect(compareVersions("1.2.4", "1.2.3")).toBe(1);
        expect(compareVersions("1.3.0", "1.2.3")).toBe(1);
        expect(compareVersions("2.0.0", "1.2.3")).toBe(1);
        expect(compareVersions("1", "0")).toBe(1);
        expect(compareVersions("1", "0.0")).toBe(1);
        expect(compareVersions("1", "0.0.0-beta")).toBe(1);
        expect(compareVersions("1", "0.10.10")).toBe(1);
        expect(compareVersions("1.1", "1")).toBe(1);
        expect(compareVersions("1.0.1", "1")).toBe(1);
    });

    it("treats missing parts as zeros", () => {
        expect(compareVersions("1.2", "1.2.0")).toBe(0);
        expect(compareVersions("1.2.0", "1.2")).toBe(0);
        expect(compareVersions("1", "1.0.0")).toBe(0);
        expect(compareVersions("1.0.0", "1")).toBe(0);
    });
});
