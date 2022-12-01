import * as core from "@actions/core";
import * as exec from "@actions/exec";

import { Events, State } from "./constants";
import * as utils from "./utils/actionUtils";

// Catch and log any unhandled exceptions.  These exceptions can leak out of the uploadChunk method in
// @actions/toolkit when a failed upload closes the file descriptor causing any in-process reads to
// throw an uncaught exception.  Instead of failing this action, just warn.
process.on("uncaughtException", e => utils.logWarning(e.message));

async function run(): Promise<void> {
    try {
        if (utils.isGhes()) {
            utils.logWarning(
                "Cache action is not supported on GHES. See https://github.com/actions/cache/issues/505 for more details"
            );
            return;
        }

        if (!utils.isValidEvent()) {
            utils.logWarning(
                `Event Validation Error: The event type ${
                    process.env[Events.Key]
                } is not supported because it's not tied to a branch or tag ref.`
            );
            return;
        }

        const skip = core.getState(State.Skip);

        console.info(`skip: ${skip}`);

        if (skip != "true") {
            const enableSave = core.getState(State.EnableSave);

            if (enableSave == "true") {
                const distDirOption = core.getState(State.CacheDistDirOption);
                const storePathOption = core.getState(
                    State.CacheStorePathOption
                );
                const regionOption = core.getState(State.CacheRegionOption);
                const archiveUriOption = core.getState(
                    State.CacheArchiveUriOption
                );
                const threadsOption = core.getState(State.CacheThreadsOption);
                const hostNameOption = core.getState(State.CacheHostNameOption);
                const hostPortOption = core.getState(State.CacheHostPortOption);
                const hostSslOption = core.getState(State.CacheHostSslOption);

                await exec.exec(
                    "cabal-cache sync-to-archive" +
                        ` ${threadsOption} ` +
                        ` ${archiveUriOption} ` +
                        ` ${regionOption} ` +
                        ` ${storePathOption} ` +
                        ` ${distDirOption} ` +
                        ` ${hostNameOption} ` +
                        ` ${hostPortOption} ` +
                        ` ${hostSslOption} ` +
                        ""
                );

                core.info("Done");
            } else {
                core.info("Save disabled");
            }
        } else {
            console.info("Skipping");
        }
    } catch (error) {
        utils.logWarning(error.message);
    }
}

run();

export default run;
