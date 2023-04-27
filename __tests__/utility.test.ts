import { execCommand, readVersion } from "../src/utility";
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
