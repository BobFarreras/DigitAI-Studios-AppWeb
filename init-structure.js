const fs = require('fs');
const path = require('path');

// Definició de l'estructura "Clean Architecture"
const structure = [
  'content',
  'messages',
  'tests/e2e',
  'src/core/entities',
  'src/core/repositories',
  'src/core/errors',
  'src/core/types',
  'src/application/use-cases',
  'src/infrastructure/repositories',
  'src/infrastructure/adapters',
  'src/infrastructure/config',
  'src/presentation/actions',
  'src/presentation/components/ui',
  'src/presentation/components/features',
  'src/presentation/hooks',
  'src/presentation/utils',
  'src/app/[locale]/api',
  'src/app/[locale]/(dashboard)',
  'src/app/[locale]/(auth)',
];

const filesToCreate = [
  {
    path: 'messages/ca.json',
    content: '{ "app": { "name": "La Meva App" } }'
  },
  {
    path: 'messages/en.json',
    content: '{ "app": { "name": "My App" } }'
  },
  {
    path: 'src/core/README.md',
    content: '# Core Layer\nAquesta capa conté la lògica de negoci pura. NO dependències externes.'
  },
  {
    path: 'src/application/README.md',
    content: '# Application Layer\nAquesta capa conté els Casos d\'Ús (Use Cases).'
  },
  {
    path: 'src/infrastructure/README.md',
    content: '# Infrastructure Layer\nImplementació de repositoris, adaptadors externs i clients de BD.'
  }
];

console.log('🚀 Iniciant creació d\'estructura Enterprise...\n');

// Crear Carpetes
structure.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Carpeta creada: ${dir}`);
  } else {
    console.log(`⚠️  Ja existeix: ${dir}`);
  }
});

// Crear Arxius base
filesToCreate.forEach(file => {
  const fullPath = path.join(__dirname, file.path);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, file.content);
    console.log(`📄 Fitxer creat: ${file.path}`);
  }
});

console.log('\n🎉 Estructura completada! Ja pots esborrar aquest script.');
console.log('RECORDA: Mou la teva carpeta "app" actual dins de "src/" si encara no ho has fet.');