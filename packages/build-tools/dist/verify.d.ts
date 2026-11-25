export interface VerifyResult {
    ok: boolean;
    errors: string[];
    warnings: string[];
    summary: Record<string, string | number | boolean | null>;
}
export declare function verifyLinks(workspaceRoot: string): VerifyResult;
export declare function verifyPages(workspaceRoot: string): VerifyResult;
