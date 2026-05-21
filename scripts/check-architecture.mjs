import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'node:fs';

const allowlistPath = 'scripts/architecture-db-allowlist.txt';

function getAllowlist(path) {
  if (!existsSync(path)) return new Set();
  const content = readFileSync(path, 'utf8');
  return new Set(content.split('\n').map((v) => v.trim().replaceAll('\\', '/')).filter(Boolean));
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
  const files = globSync(`${dir}/**/*.tsx`, { exclude: () => false });
  for (const file of files) {
    const normalizedFile = file.replaceAll('\\', '/');
    if (allowlist.has(normalizedFile)) continue;
    
    const content = readFileSync(file, 'utf8');
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(content)) {
        violatingFiles.add(normalizedFile);
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
