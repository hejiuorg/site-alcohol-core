import fs from 'node:fs';
import path from 'node:path';
import * as pagefind from 'pagefind';
import { loadContracts } from './contracts.js';
import { publishedSearchRecords } from './pages.js';
async function writeBundle(records, outputPath) {
    fs.mkdirSync(outputPath, { recursive: true });
    const created = await pagefind.createIndex();
    if (!created.index) {
        throw new Error(`Pagefind could not create an index: ${created.errors.join('; ')}`);
    }
    for (const record of records) {
        const added = await created.index.addCustomRecord({
            url: record.url,
            content: record.content,
            language: record.language,
            meta: record.meta,
            filters: record.filters,
        });
        if (added.errors.length > 0) {
            throw new Error(`Pagefind record error for ${record.url}: ${added.errors.join('; ')}`);
        }
    }
    const written = await created.index.writeFiles({ outputPath });
    if (written.errors.length > 0) {
        throw new Error(`Pagefind write error: ${written.errors.join('; ')}`);
    }
    await pagefind.close();
}
export async function writeSiteSearch(index, siteKey, distDir) {
    const records = publishedSearchRecords(index, { siteKey });
    await writeBundle(records, path.join(distDir, 'pagefind'));
    return records.length;
}
export function writePublishedRecordFile(workspaceRoot, siteKey, contentTreeHash, records) {
    const dir = path.join(workspaceRoot, '.hejiu', 'published');
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${siteKey}.json`);
    const payload = {
        schemaVersion: 1,
        siteKey,
        generatedAt: new Date().toISOString(),
        contentTreeSha256: contentTreeHash,
        records,
    };
    fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
    return file;
}
export async function writeAggregateSearch(workspaceRoot) {
    const contracts = loadContracts(workspaceRoot);
    const main = contracts.sites.find((entry) => entry.main);
    if (!main)
        throw new Error('Main site is missing from sites.json');
    const mainDist = path.join(workspaceRoot, 'site-repositories', main.siteRepository, main.appDirectory, 'dist');
    if (!fs.existsSync(mainDist)) {
        throw new Error(`Main site dist does not exist: ${mainDist}. Build main first.`);
    }
    const publishedDir = path.join(workspaceRoot, '.hejiu', 'published');
    const sources = [];
    const records = [];
    for (const site of contracts.sites) {
        const file = path.join(publishedDir, `${site.key}.json`);
        if (!fs.existsSync(file)) {
            throw new Error(`Published search source for ${site.key} is missing: ${file}`);
        }
        const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (payload.siteKey !== site.key) {
            throw new Error(`Published search source ${file} has the wrong site key`);
        }
        sources.push({
            siteKey: payload.siteKey,
            generatedAt: payload.generatedAt,
            contentTreeSha256: payload.contentTreeSha256,
            recordCount: payload.records.length,
        });
        records.push(...payload.records);
    }
    const deduped = [...new Map(records.map((record) => [record.url, record])).values()].sort((a, b) => a.url.localeCompare(b.url));
    const outputPath = path.join(mainDist, 'all-search');
    const tempPath = `${outputPath}.tmp-${process.pid}`;
    const backupPath = `${outputPath}.old-${process.pid}`;
    fs.rmSync(tempPath, { recursive: true, force: true });
    fs.rmSync(backupPath, { recursive: true, force: true });
    try {
        await writeBundle(deduped, tempPath);
        fs.writeFileSync(path.join(tempPath, 'aggregate-manifest.json'), `${JSON.stringify({
            schemaVersion: 1,
            generatedAt: new Date().toISOString(),
            scope: 'published-only',
            sources,
            recordCount: deduped.length,
        }, null, 2)}\n`);
        if (fs.existsSync(outputPath))
            fs.renameSync(outputPath, backupPath);
        fs.renameSync(tempPath, outputPath);
        fs.rmSync(tempPath, { recursive: true, force: true });
        fs.rmSync(backupPath, { recursive: true, force: true });
    }
    catch (error) {
        fs.rmSync(tempPath, { recursive: true, force: true });
        if (fs.existsSync(backupPath) && !fs.existsSync(outputPath)) {
            fs.renameSync(backupPath, outputPath);
        }
        throw error;
    }
    return { records: deduped.length, sites: sources.map((source) => source.siteKey), outputPath };
}
