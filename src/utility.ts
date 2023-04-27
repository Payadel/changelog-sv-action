import * as exec from "@actions/exec";
import fs from "fs";

export function execCommand(
    command: string,
    errorMessage: string | null = null
): Promise<exec.ExecOutput> {
    return exec.getExecOutput(command).then(output => {
        if (output.exitCode === 0) return output;

        errorMessage = errorMessage || `Execute ${command} failed.`;
        throw new Error(`${errorMessage}\n${output.stderr}`);
    });
}

export function readVersion(): Promise<string> {
    return execCommand(
        "node -p -e \"require('./package.json').version\"",
        "Read version from package.json failed."
    ).then(version => version.stdout.trim());
}

export function readFile(fileName: string): Promise<string> {
    return new Promise<string>(resolve =>
        resolve(fs.readFileSync(fileName, "utf8").trim())
    );
}
