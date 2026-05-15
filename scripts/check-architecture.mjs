import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const allowlistPath = 'scripts/architecture-db-allowlist.txt';

function run(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    if (typeof error?.status === 'number' && error.status === 1) {
      return '';
    }
    throw error;
  }
}

function getAllowlist(path) {
  if (!existsSync(path)) return new Set();
  const content = readFileSync(path, 'utf8');
  return new Set(content.split('\n').map((v) => v.trim().replaceAll('\\', '/')).filter(Boolean));
}

const allowlist = getAllowlist(allowlistPath);
const targetGlobs = 'src/app src/components src/features --glob "*.tsx"';

const repositoryImportOutput = run(`rg -n "from ['\\"]@/repositories" ${targetGlobs}`);
const supabaseServerImportOutput = run(`rg -n "from ['\\"]@/lib/supabase/server" ${targetGlobs}`);
const supabaseMiddlewareImportOutput = run(`rg -n "from ['\\"]@/lib/supabase/middleware" ${targetGlobs}`);
const supabaseClientImportOutput = run(`rg -n "from ['\\"]@/lib/supabase/client" ${targetGlobs}`);

const rows = [
  ...repositoryImportOutput.split('\n'),
  ...supabaseServerImportOutput.split('\n'),
  ...supabaseMiddlewareImportOutput.split('\n'),
  ...supabaseClientImportOutput.split('\n'),
].filter(Boolean);
const violatingFiles = new Set();

for (const row of rows) {
  const [file] = row.split(':');
  const normalizedFile = file.replaceAll('\\', '/');
  if (!allowlist.has(normalizedFile)) {
    violatingFiles.add(normalizedFile);
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
