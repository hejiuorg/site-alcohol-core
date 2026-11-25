import type { ValidationIssue } from './types.js';
export interface ValidationReport {
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
    summary: {
        records: number;
        entities: number;
        publishedRecords: number;
        contentTreeSha256: string;
        migrationMapped: number;
        migrationPending: number;
    };
}
export declare function validateAll(workspaceRoot: string): ValidationReport;
