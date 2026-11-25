import type { BuildMode, ContentIndex, EntityRegistry, Lang, ListPageData, PageData, SiteBuildData, SiteContract, TypeContract } from './types.js';
export declare function pagePath(typePath: string, slug: string, lang: Lang): string;
export declare function originFor(site: SiteContract, previewOrigins: Record<string, string> | null): string;
export declare function absoluteUrl(site: SiteContract, pathName: string, previewOrigins: Record<string, string> | null): string;
export declare function buildRegistry(index: ContentIndex, mode: BuildMode, previewOrigins: Record<string, string> | null): EntityRegistry;
export declare function getSiteBuildData(siteKey: string, options?: {
    workspaceRoot?: string;
    mode?: BuildMode;
    previewOrigins?: Record<string, string> | null;
}): SiteBuildData;
export declare function getStaticDetailPaths(siteKey: string, lang: Lang): {
    params: {
        typePath: string;
        slug: string;
    };
    props: {
        page: PageData;
    };
}[];
export declare function getStaticListPaths(siteKey: string, lang: Lang): {
    params: {
        typePath: string;
    };
    props: {
        list: ListPageData;
    };
}[];
export declare function getHomePages(siteKey: string, lang: Lang): PageData[];
export declare function getTypeCounts(siteKey: string, lang: Lang): Array<{
    type: TypeContract;
    count: number;
}>;
export declare function getSitemap(siteKey: string): string;
export interface SearchRecord {
    url: string;
    content: string;
    language: Lang;
    meta: Record<string, string>;
    filters: Record<string, string[]>;
}
export declare function publishedSearchRecords(index: ContentIndex, options?: {
    siteKey?: string;
    absolute?: boolean;
}): SearchRecord[];
export declare function entitySummary(index: ContentIndex, id: string): {
    id: string;
    title: string;
    type: string;
    siteKey: string;
    path: string | null;
    published: boolean;
} | null;
