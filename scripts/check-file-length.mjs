import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const LIMIT = 150;
const target = process.argv[2] ?? 'src';
const allowlistPath = 'scripts/line-limit-allowlist.txt';

function parseFilesFromGit() {
  const out = execSync(`git ls-files ${target}`, { encoding: 'utf8' });
  return out
    .split('\n')
    .filter(Boolean)
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .filter((f) => existsSync(f));
}

function getAllowlist(path) {
  if (!existsSync(path)) return new Set();
  const content = readFileSync(path, 'utf8');
  return new Set(content.split('\n').map((v) => v.trim().replaceAll('\\', '/')).filter(Boolean));
}

function countLines(path) {
  return readFileSync(path, 'utf8').split('\n').length;
}

const allowlist = getAllowlist(allowlistPath);
const files = parseFilesFromGit();
const violations = [];

for (const file of files) {
  const normalizedFile = file.replaceAll('\\', '/');
  const lines = countLines(file);
  if (lines > LIMIT && !allowlist.has(normalizedFile)) {
    violations.push({ file: normalizedFile, lines });
  }
}

if (violations.length > 0) {
  console.error('Line limit violations (>150 lines) outside allowlist:');
  for (const v of violations) {
    console.error(`- ${v.file} (${v.lines})`);
  }
  process.exit(1);
}

console.log('check:lines passed');
