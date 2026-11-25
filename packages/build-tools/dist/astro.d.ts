import type { AstroIntegration } from 'astro';
export interface HejiuIntegrationOptions {
    siteKey: string;
}
export declare function hejiu(options: HejiuIntegrationOptions): AstroIntegration;
