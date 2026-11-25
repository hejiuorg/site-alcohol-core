import type { ContentIndex, ContentRecord, Contracts, Entity, Lang, Relation, ValidationIssue } from './types.js';
export declare function sha256(input: string | Buffer): string;
export declare function normalizedTextSha256(raw: string): string;
export declare function recordKey(id: string, lang: Lang): string;
export declare function effectiveRelations(contracts: Contracts, record: ContentRecord): Relation[];
export declare function loadLegacyLedger(workspaceRoot: string): Set<string> | null;
export declare function loadMigrationMap(workspaceRoot: string): Map<string, {
    status: string;
    targetRefs: string[];
}> | null;
export declare function loadContent(workspaceRoot?: string, contracts?: Contracts): ContentIndex;
export declare function contentTreeSha256(index: ContentIndex): string;
export declare function recordPublication(record: ContentRecord, index: ContentIndex): {
    published: boolean;
    outdated: boolean;
    reason: string | null;
};
export declare function entityLabel(entity: Entity, lang: Lang): string;
export declare function errorsOnly(issues: ValidationIssue[]): ValidationIssue[];
