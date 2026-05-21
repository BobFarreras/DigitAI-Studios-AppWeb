import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const allowlistPath = 'scripts/architecture-db-allowlist.txt';

function getAllowlist(path) {
  if (!existsSync(path)) return new Set();
  const content = readFileSync(path, 'utf8');
  return new Set(content.split('\n').map((v) => v.trim().replaceAll('\\', '/')).filter(Boolean));
}

function getTsxFiles(dir) {
  const results = [];
  function scan(currentDir) {
    let entries;
    try {
      entries = readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name).replaceAll('\\', '/');
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        results.push(fullPath);
      }
    }
  }
  scan(dir);
  return results;
}

const allowlist = getAllowlist(allowlistPath);

// Patterns to search for in .tsx files (UI layer should not import these)
const forbiddenPatterns = [
  /from\s+['"]@\/repositories['"]/,
  /from\s+['"]@\/lib\/supabase\/server['"]/,
  /from\s+['"]@\/lib\/supabase\/middleware['"]/,
  /from\s+['"]@\/lib\/supabase\/client['"]/,
];

const targetDirs = ['src/app', 'src/components', 'src/features'];
const violatingFiles = new Set();

for (const dir of targetDirs) {
  const files = getTsxFiles(dir);
  for (const file of files) {
    if (allowlist.has(file)) continue;

    const content = readFileSync(file, 'utf8');
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(content)) {
        violatingFiles.add(file);
        break;
      }
    }
  }
}

if (violatingFiles.size > 0) {
  console.error('Architecture violations (repository/supabase imports in UI layers outside allowlist):');
  for (const file of [...violatingFiles].sort()) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log('check:architecture passed');
