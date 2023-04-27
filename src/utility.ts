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

export function readVersion(package_path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!fs.existsSync(package_path)) {
            return reject(
                new Error(`Can not find package.json in '${package_path}'.`)
            );
        }
        return execCommand(
            `node -p -e "require('${package_path}').version"`,
            `Read version from '${package_path}' failed.`
        ).then(version => resolve(version.stdout.trim()));
    });
}

export function readFile(fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!fs.existsSync(fileName)) {
            return reject(new Error(`Can not find '${fileName}'.`));
        }
        resolve(fs.readFileSync(fileName, "utf8").trim());
    });
}
