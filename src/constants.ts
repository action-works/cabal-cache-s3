export enum Inputs {
    CabalCacheDownloadUri = "cabal-cache-download-uri",
    CabalCacheVersion = "cabal-cache-version",
    DistDir = "dist-dir",
    Path = "path",
    StorePath = "store-path",
    Region = "region",
    ArchiveUri = "archive-uri",
    Threads = "threads",
    HostName = "host-name",
    HostPort = "host-port",
    HostSsl = "host-ssl",
    EnableSave = "enable-save",
    Skip = "skip"
}

export enum Outputs {
    CacheHit = "cache-hit"
}

export enum State {
    CacheDistDirOption = "DIST_DIR_OPTION",
    CachePathOption = "PATH_OPTION",
    CacheStorePathOption = "STORE_PATH_OPTION",
    CacheRegionOption = "REGION_OPTION",
    CacheArchiveUriOption = "ARCHIVE_URI_OPTION",
    CacheThreadsOption = "THREADS_OPTION",
    CacheHostNameOption = "HOST_NAME",
    CacheHostPortOption = "HOST_PORT",
    CacheHostSslOption = "HOST_SSL",
    EnableSave = "ENABLE_SAVE",
    Skip = "SKIP"
}

export enum Events {
    Key = "GITHUB_EVENT_NAME",
    Push = "push",
    PullRequest = "pull_request"
}

export const RefKey = "GITHUB_REF";
