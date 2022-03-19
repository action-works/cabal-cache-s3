import { Inputs } from "../constants";

// See: https://github.com/actions/toolkit/blob/master/packages/core/src/core.ts#L67
function getInputName(name: string): string {
    return `INPUT_${name.replace(/ /g, "_").toUpperCase()}`;
}

export function setInput(name: string, value: string): void {
    process.env[getInputName(name)] = value;
}

interface CacheInput {
    distDir: string;
    keyPrefix: string;
    storePath: string;
}

export function setInputs(input: CacheInput): void {
    setInput(Inputs.StorePath, input.storePath);
    setInput(Inputs.DistDir, input.distDir);
}

export function clearInputs(): void {
    delete process.env[getInputName(Inputs.DistDir)];
    delete process.env[getInputName(Inputs.StorePath)];
}
