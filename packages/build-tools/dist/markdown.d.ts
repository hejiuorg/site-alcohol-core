import type { Heading } from './types.js';
export interface RenderResult {
    html: string;
    headings: Heading[];
    unresolvedRefs: string[];
}
export declare function renderMarkdown(body: string, resolveRef?: (key: string) => string | null): RenderResult;
export declare function markdownToText(body: string): string;
export declare function collectRefKeys(body: string): string[];
