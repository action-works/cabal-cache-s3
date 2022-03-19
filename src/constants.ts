export enum Inputs {
    CabalCacheDownloadUri = "cabal-cache-download-uri",
    CabalCacheVersion = "cabal-cache-version",
    DistDir = "dist-dir",
    StorePath = "store-path",
    Region = "region",
    ArchiveUri = "archive-uri",
    Threads = "threads",
    EnableSave = "enable-save",
    Skip = "skip"
}

export enum Outputs {
    CacheHit = "cache-hit"
}

export enum State {
    CacheDistDirOption = "DIST_DIR_OPTION",
    CacheStorePathOption = "STORE_PATH_OPTION",
    CacheRegionOption = "REGION_OPTION",
    CacheArchiveUriOption = "ARCHIVE_URI_OPTION",
    CacheThreadsOption = "THREADS_OPTION",
    EnableSave = "ENABLE_SAVE",
    Skip = "SKIP"
}

export enum Events {
    Key = "GITHUB_EVENT_NAME",
    Push = "push",
    PullRequest = "pull_request"
}

export const RefKey = "GITHUB_REF";
