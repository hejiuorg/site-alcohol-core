import type { Contracts, ValidationIssue } from './types.js';
export declare function checkCatalogs(workspaceRoot: string, contracts: Contracts, addIssue: (issue: ValidationIssue) => void): void;
