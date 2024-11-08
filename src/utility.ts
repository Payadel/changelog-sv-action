import * as exec from "@actions/exec";
import fs from "fs";

export async function execCommand(
    command: string,
    errorMessage: string | null = null
): Promise<exec.ExecOutput> {
    let output: exec.ExecOutput | PromiseLike<exec.ExecOutput>;
    try {
        output = await exec.getExecOutput(command);
        if (output.exitCode === 0) return output;
    } catch (error: any) {
        const title = errorMessage || `Execute '${command}' failed.`;
        const message =
            error instanceof Error ? error.message : error.toString();
        throw new Error(`${title}\n${message}`);
    }
    throw new Error(`${output.stderr}\n${output.stdout}`);
}

export function readFile(fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!fs.existsSync(fileName)) {
            return reject(new Error(`Can not find '${fileName}'.`));
        }
        resolve(fs.readFileSync(fileName, "utf8").trim());
    });
}

export async function readChangelogSection(
    changelog_file: string,
    version: string,
    pattern: RegExp
): Promise<string> {
    const content = await readFile(changelog_file);
    const lines = content.split("\n");
    version = version.toLowerCase();
    const headerLines: { line: string; index: number }[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i]))
            headerLines.push({ line: lines[i], index: i });
    }
    if (headerLines.length === 0) {
        throw new Error(
            "Can not find or detect any changelog header.\n" +
                "You can update regex or report this issue with details."
        );
    }
    const targetIndex = headerLines.findIndex(line =>
        new RegExp(`\\b${version}\\b`).test(line.line)
    );
    if (targetIndex < 0) {
        throw new Error(
            `Can not find or detect any changelog with version ${version}.\n` +
                "You can update regex or report this issue with details."
        );
    }
    const startLineIndex = headerLines[targetIndex].index;
    const endLineIndex =
        targetIndex + 1 < headerLines.length
            ? headerLines[targetIndex + 1].index
            : lines.length;
    return lines.slice(startLineIndex, endLineIndex).join("\n");
}
