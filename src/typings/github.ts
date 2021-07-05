interface Assets {
    name: string;
    browser_download_url: string;
}

interface Release {
    tag_name: string;
    assets: Assets[];
}

export type GithubResponse = Release[];