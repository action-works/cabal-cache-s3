import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";

import { Events, Inputs, State } from "./constants";
import * as utils from "./utils/actionUtils";

async function downloadTool(uri: string): Promise<string> {
    console.info(`Downloading: ${uri}`);

    const result = await tc.downloadTool(uri);

    return result;
}

async function downloadCabalCache(
    cabalCacheDownloadUri: string,
    cabalCacheVersion: string
): Promise<string> {
    const downloadPrefix =
        cabalCacheVersion == "latest"
            ? `${cabalCacheDownloadUri}/latest/download`
            : `${cabalCacheDownloadUri}/download/v${cabalCacheVersion}`;

    if (process.platform === "win32") {
        const cabalCachePath = await downloadTool(
            `${downloadPrefix}/cabal-cache-x86_64-windows.tar.gz`
        );
        const cabalCacheExtractedFolder = await tc.extractTar(cabalCachePath);
        return cabalCacheExtractedFolder;
    } else if (process.platform === "darwin") {
        const cabalCachePath = await downloadTool(
            `${downloadPrefix}/cabal-cache-arm64-darwin.tar.gz`
        );
        const cabalCacheExtractedFolder = await tc.extractTar(cabalCachePath);
        return cabalCacheExtractedFolder;
    } else if (process.platform === "linux") {
        const cabalCachePath = await downloadTool(
            `${downloadPrefix}/cabal-cache-x86_64-linux.tar.gz`
        );
        const cabalCacheExtractedFolder = await tc.extractTar(cabalCachePath);
        return cabalCacheExtractedFolder;
    } else {
        core.setFailed("Download failed");
        throw "Download failed 2";
    }
}

async function installTool(
    cabalCacheDownloadUri: string,
    cabalCacheVersion: string
): Promise<string> {
    const cabalCachePath = await downloadCabalCache(
        cabalCacheDownloadUri,
        cabalCacheVersion
    );

    core.addPath(cabalCachePath);

    await exec.exec("cabal-cache version");

    return cabalCachePath;
}

async function run(): Promise<void> {
    try {
        if (utils.isGhes()) {
            utils.logWarning(
                "Cache action is not supported on GHES. See https://github.com/actions/cache/issues/505 for more details"
            );
            utils.setCacheHitOutput(false);
            return;
        }

        // Validate inputs, this can cause task failure
        if (!utils.isValidEvent()) {
            utils.logWarning(
                `Event Validation Error: The event type ${
                    process.env[Events.Key]
                } is not supported because it's not tied to a branch or tag ref.`
            );
            return;
        }

        const skip = core.getInput(Inputs.Skip, { required: false });

        core.saveState(State.Skip, skip);

        console.info(`skip: ${skip}`);

        if (skip != "true") {
            console.info("Extracting parameters");
            const cabalCacheDownloadUri = core.getInput(
                Inputs.CabalCacheDownloadUri,
                { required: true }
            );
            const cabalCacheVersion = core.getInput(Inputs.CabalCacheVersion, {
                required: true
            });
            const path = core.getInput(Inputs.Path, {
                required: false
            });
            const storePath = core.getInput(Inputs.StorePath, {
                required: false
            });
            const distDir = core.getInput(Inputs.DistDir, { required: false });
            const region = core.getInput(Inputs.Region, { required: false });
            const archiveUri = core.getInput(Inputs.ArchiveUri, {
                required: false
            });
            const threads = core.getInput(Inputs.Threads, { required: false });
            const enableSave = core.getInput(Inputs.EnableSave, {
                required: true
            });
            const hostName = core.getInput(Inputs.HostName, {
                required: false
            });
            const hostPort = core.getInput(Inputs.HostPort, {
                required: false
            });
            const hostSsl = core.getInput(Inputs.HostSsl, { required: false });

            console.info("Building options");
            const distDirOption =
                distDir != "" ? `--build-path ${distDir}` : "";
            const pathOption = path != "" ? `--path ${path}` : "";
            const storePathOption =
                storePath != "" ? `--store-path ${storePath}` : "";
            const regionOption = region != "" ? `--region ${region}` : "";
            const archiveUriOption =
                archiveUri != "" ? `--archive-uri ${archiveUri}` : "";
            const threadsOption = threads != "" ? `--threads ${threads}` : "";
            const hostNameOption =
                hostName != "" ? `--host-name-override ${hostName}` : "";
            const hostPortOption =
                hostPort != "" ? `--host-port-override ${hostPort}` : "";
            const hostSslOption =
                hostSsl != "" ? `--host-ssl-override ${hostSsl}` : "";

            console.info("Saving state");
            core.saveState(State.EnableSave, enableSave);
            core.saveState(State.CacheDistDirOption, distDirOption);
            core.saveState(State.CachePathOption, pathOption);
            core.saveState(State.CacheStorePathOption, storePathOption);
            core.saveState(State.CacheRegionOption, regionOption);
            core.saveState(State.CacheArchiveUriOption, archiveUriOption);
            core.saveState(State.CacheThreadsOption, threadsOption);
            core.saveState(State.CacheHostNameOption, hostNameOption);
            core.saveState(State.CacheHostPortOption, hostPortOption);
            core.saveState(State.CacheHostSslOption, hostSslOption);

            console.info("Installing cabal-cache");

            await installTool(cabalCacheDownloadUri, cabalCacheVersion);

            const cmd =
                "cabal-cache sync-from-archive" +
                ` ${threadsOption}` +
                ` ${archiveUriOption}` +
                ` ${regionOption}` +
                ` ${pathOption}` +
                ` ${storePathOption}` +
                ` ${distDirOption}` +
                ` ${hostNameOption}` +
                ` ${hostPortOption}` +
                ` ${hostSslOption}` +
                "";

            console.info(`Running command: ${cmd}`);

            await exec.exec(cmd);
        } else {
            console.info("Skipping");
        }
    } catch (error) {
        utils.setCacheHitOutput(false);
        core.setFailed(error.message);
    }
}

run();

export default run;
