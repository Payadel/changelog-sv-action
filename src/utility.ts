import * as exec from "@actions/exec";
import fs from "fs";

export function execCommand(
    command: string,
    errorMessage: string | null = null
): Promise<exec.ExecOutput> {
    return exec
        .getExecOutput(command)
        .then(output => {
            if (output.exitCode === 0) return output;
            throw new Error(output.stderr);
        })
        .catch(error => {
            const title = errorMessage || `Execute '${command}' failed.`;
            const message =
                error instanceof Error ? error.message : error.toString();
            throw new Error(`${title}\n${message}`);
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
