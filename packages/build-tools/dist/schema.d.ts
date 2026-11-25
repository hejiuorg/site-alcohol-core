import { z } from 'zod';
declare const idSchema: z.ZodString;
declare const slugSchema: z.ZodString;
declare const sha256Schema: z.ZodString;
export declare const contentSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    [x: string]: any;
}, z.core.$strict>, ...z.ZodObject<{
    [x: string]: any;
}, z.core.$strict>[]], "type">;
export type ParsedFrontmatter = z.infer<typeof contentSchema>;
export { idSchema, slugSchema, sha256Schema };
