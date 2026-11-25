import { type SearchRecord } from './pages.js';
import type { ContentIndex } from './types.js';
export interface PublishedSiteFile {
    schemaVersion: number;
    siteKey: string;
    generatedAt: string;
    contentTreeSha256: string;
    records: SearchRecord[];
}
export declare function writeSiteSearch(index: ContentIndex, siteKey: string, distDir: string): Promise<number>;
export declare function writePublishedRecordFile(workspaceRoot: string, siteKey: string, contentTreeHash: string, records: SearchRecord[]): string;
export interface AggregateSearchResult {
    records: number;
    sites: string[];
    outputPath: string;
}
export declare function writeAggregateSearch(workspaceRoot: string): Promise<AggregateSearchResult>;
