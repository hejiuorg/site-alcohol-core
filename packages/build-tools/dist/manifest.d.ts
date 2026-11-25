export interface SiteArtifactSummary {
    siteKey: string;
    distDir: string;
    pageCount: number;
    publishedPages: number;
    previewPages: number;
    searchRecords: number;
    manifestPath: string;
    registryPath: string;
}
export declare function writeSiteArtifacts(workspaceRoot: string, siteKey: string, distDir: string): Promise<SiteArtifactSummary>;
