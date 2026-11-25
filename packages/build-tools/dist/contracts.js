import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
export function findWorkspaceRoot(start = process.cwd()) {
    let dir = path.resolve(start);
    for (;;) {
        if (fs.existsSync(path.join(dir, 'content-repositories')) &&
            fs.existsSync(path.join(dir, 'site-repositories'))) {
            return dir;
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
            throw new Error(`Could not find the implementation workspace (content-repositories + site-repositories) from ${start}`);
        }
        dir = parent;
    }
}
function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}
export function contractDirectory(workspaceRoot) {
    const root = workspaceRoot ?? findWorkspaceRoot();
    const workspaceContracts = path.join(root, 'site-repositories', 'site-alcohol-core', 'packages', 'contracts');
    if (fs.existsSync(workspaceContracts))
        return workspaceContracts;
    return path.resolve(here, '../contracts');
}
export function getBuildMode() {
    return process.env.HEJIU_BUILD_MODE === 'preview' ? 'preview' : 'production';
}
export function getPreviewOrigins() {
    const raw = process.env.HEJIU_PREVIEW_ORIGINS;
    if (!raw)
        return null;
    const parsed = JSON.parse(raw);
    for (const [key, origin] of Object.entries(parsed)) {
        if (!/^https?:\/\/[^/]+$/.test(origin)) {
            throw new Error(`Invalid preview origin for ${key}: ${origin}`);
        }
    }
    return parsed;
}
export function loadContracts(workspaceRoot = findWorkspaceRoot()) {
    const dir = contractDirectory(workspaceRoot);
    const sites = readJson(path.join(dir, 'sites.json')).sites;
    const types = readJson(path.join(dir, 'types.json')).types;
    const relations = readJson(path.join(dir, 'relations.json'));
    const labels = readJson(path.join(dir, 'labels.json'));
    const repositories = readJson(path.join(dir, 'repositories.json'));
    if (sites.length !== 4)
        throw new Error(`Expected four sites, found ${sites.length}`);
    if (types.length !== 28)
        throw new Error(`Expected 28 content types, found ${types.length}`);
    const siteKeys = new Set(sites.map((site) => site.key));
    const typeNames = new Set();
    const routeKeys = new Set();
    const namespaces = new Set();
    for (const type of types) {
        if (typeNames.has(type.type))
            throw new Error(`Duplicate type: ${type.type}`);
        typeNames.add(type.type);
        if (namespaces.has(type.namespace))
            throw new Error(`Duplicate namespace: ${type.namespace}`);
        namespaces.add(type.namespace);
        if (!siteKeys.has(type.site))
            throw new Error(`Type ${type.type} has unknown site ${type.site}`);
        if (!/^[a-z0-9-]+$/.test(type.path))
            throw new Error(`Invalid route path: ${type.path}`);
        const routeKey = `${type.site}:${type.path}`;
        if (routeKeys.has(routeKey))
            throw new Error(`Duplicate route: ${routeKey}`);
        routeKeys.add(routeKey);
    }
    for (const site of sites) {
        const fromRepositories = repositories.sites.find((entry) => entry.key === site.key);
        if (!fromRepositories)
            throw new Error(`Site ${site.key} missing from repositories.json`);
        if (fromRepositories.contentRepository !== site.contentRepository) {
            throw new Error(`Content repository mismatch for ${site.key}`);
        }
        if ((fromRepositories.contentPath ?? null) !== (site.contentPath ?? null)) {
            throw new Error(`Content path mismatch for ${site.key}`);
        }
        if (fromRepositories.siteRepository !== site.siteRepository) {
            throw new Error(`Site repository mismatch for ${site.key}`);
        }
        if (fromRepositories.host !== site.host)
            throw new Error(`Host mismatch for ${site.key}`);
        if (!types.some((type) => type.site === site.key)) {
            throw new Error(`Site ${site.key} has no content types`);
        }
    }
    if (sites.filter((site) => site.main).length !== 1) {
        throw new Error('Exactly one site must be marked as the main site');
    }
    return {
        sites,
        types,
        relations,
        labels,
        repositories,
        contractDir: dir,
        workspaceRoot,
    };
}
export function siteForKey(contracts, key) {
    const site = contracts.sites.find((entry) => entry.key === key);
    if (!site)
        throw new Error(`Unknown site key: ${key}`);
    return site;
}
export function typesForSite(contracts, siteKey) {
    return contracts.types.filter((type) => type.site === siteKey);
}
export function typeForName(contracts, typeName) {
    const type = contracts.types.find((entry) => entry.type === typeName);
    if (!type)
        throw new Error(`Unknown content type: ${typeName}`);
    return type;
}
export function isLang(value) {
    return value === 'zh' || value === 'en';
}
