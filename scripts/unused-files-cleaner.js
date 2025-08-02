#!/usr/bin/env node

/**
 * Nettoyeur de fichiers inutilisés pour la branche LYO
 * Scan et suppression automatique des fichiers non référencés
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Nettoyage des fichiers inutilisés - Branche LYO\n');

// Extensions de fichiers à analyser
const EXTENSIONS = {
  code: ['.ts', '.tsx', '.js', '.jsx'],
  assets: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.webp'],
  styles: ['.css', '.scss', '.sass', '.less'],
  configs: ['.json', '.yaml', '.yml', '.toml']
};

// Répertoires à ignorer
const IGNORE_DIRS = [
  'node_modules', '.git', '.next', 'dist', 'build', '.cache',
  '.vite', '.turbo', '.vercel', '.netlify'
];

// Fichiers à toujours conserver
const KEEP_FILES = [
  'package.json', 'package-lock.json', 'tsconfig.json',
  'vite.config.ts', 'tailwind.config.ts', 'postcss.config.js',
  'eslint.config.js', 'README.md', '.gitignore', 'favicon.ico'
];

// 1. Scanner tous les fichiers du projet
function getAllFiles() {
  console.log('📂 Scan des fichiers du projet...');
  
  const allFiles = new Set();
  const projectRoot = path.join(__dirname, '..');
  
  function scanDirectory(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = prefix ? `${prefix}/${file}` : file;
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!IGNORE_DIRS.includes(file) && !file.startsWith('.')) {
          scanDirectory(filePath, relativePath);
        }
      } else {
        allFiles.add(relativePath);
      }
    });
  }
  
  scanDirectory(projectRoot);
  console.log(`  📊 ${allFiles.size} fichiers trouvés\n`);
  
  return allFiles;
}

// 2. Trouver les fichiers référencés dans le code
function findReferencedFiles() {
  console.log('🔍 Recherche des références de fichiers...');
  
  const referencedFiles = new Set();
  const srcDir = path.join(__dirname, '../src');
  const publicDir = path.join(__dirname, '../public');
  
  function extractReferences(content) {
    const patterns = [
      // Imports ES6/CommonJS
      /import\s+.*\s+from\s+['"`]([^'"`]+)['"`]/g,
      /require\(['"`]([^'"`]+)['"`]\)/g,
      // Assets publics
      /['"`]\/([^'"`\s]+\.(?:png|jpg|jpeg|gif|svg|ico|pdf|zip|webp))['"`]/g,
      // Imports dynamiques
      /import\(['"`]([^'"`]+)['"`]\)/g,
      // Références CSS
      /url\(['"`]?([^'"`\)]+)['"`]?\)/g
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const filePath = match[1];
        
        // Normaliser le chemin
        if (filePath.startsWith('./') || filePath.startsWith('../')) {
          // Chemins relatifs
          referencedFiles.add(filePath);
        } else if (filePath.startsWith('/')) {
          // Chemins absolus (assets publics)
          referencedFiles.add(filePath.substring(1));
        } else if (filePath.startsWith('@/')) {
          // Alias @ vers src
          referencedFiles.add(filePath.replace('@/', 'src/'));
        }
      }
    });
  }
  
  function scanCodeFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        scanCodeFiles(filePath);
      } else if (stat.isFile()) {
        const ext = path.extname(file);
        if ([...EXTENSIONS.code, ...EXTENSIONS.styles].includes(ext)) {
          const content = fs.readFileSync(filePath, 'utf8');
          extractReferences(content);
        }
      }
    });
  }
  
  // Scanner src et public
  if (fs.existsSync(srcDir)) scanCodeFiles(srcDir);
  if (fs.existsSync(publicDir)) scanCodeFiles(publicDir);
  
  console.log(`  📊 ${referencedFiles.size} références trouvées\n`);
  
  return referencedFiles;
}

// 3. Identifier les fichiers inutilisés
function findUnusedFiles(allFiles, referencedFiles) {
  console.log('🔍 Identification des fichiers inutilisés...');
  
  const unusedFiles = [];
  
  allFiles.forEach(file => {
    // Ignorer les fichiers à conserver
    if (KEEP_FILES.includes(path.basename(file))) {
      return;
    }
    
    // Ignorer les répertoires système
    if (IGNORE_DIRS.some(dir => file.startsWith(dir + '/'))) {
      return;
    }
    
    // Vérifier si le fichier est référencé
    let isReferenced = false;
    
    // Vérification exacte
    if (referencedFiles.has(file)) {
      isReferenced = true;
    }
    
    // Vérification partielle (pour les chemins relatifs)
    if (!isReferenced) {
      const fileName = path.basename(file);
      const fileNameWithoutExt = path.basename(file, path.extname(file));
      
      for (const ref of referencedFiles) {
        if (ref.includes(fileName) || ref.includes(fileNameWithoutExt)) {
          isReferenced = true;
          break;
        }
      }
    }
    
    if (!isReferenced) {
      unusedFiles.push(file);
    }
  });
  
  console.log(`  📊 ${unusedFiles.length} fichiers inutilisés identifiés\n`);
  
  return unusedFiles;
}

// 4. Supprimer les fichiers inutilisés (mode sécurisé)
function removeUnusedFiles(unusedFiles, dryRun = true) {
  console.log(dryRun ? '👀 Simulation de suppression...' : '🗑️ Suppression des fichiers...');
  
  let totalSize = 0;
  let removedCount = 0;
  
  unusedFiles.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    
    try {
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath);
        totalSize += stat.size;
        
        if (!dryRun) {
          fs.unlinkSync(fullPath);
        }
        
        removedCount++;
        console.log(`  ${dryRun ? '📋' : '✅'} ${file} (${(stat.size / 1024).toFixed(2)} KB)`);
      }
    } catch (error) {
      console.log(`  ⚠️ Erreur avec ${file}: ${error.message}`);
    }
  });
  
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  
  console.log(`\n📊 Résumé:`);
  console.log(`  📁 Fichiers ${dryRun ? 'à supprimer' : 'supprimés'}: ${removedCount}`);
  console.log(`  💾 Espace ${dryRun ? 'libérable' : 'libéré'}: ${totalSizeMB} MB`);
  
  return { count: removedCount, sizeMB: parseFloat(totalSizeMB) };
}

// 5. Générer le rapport de nettoyage
function generateCleanupReport(summary) {
  console.log('\n📋 Génération du rapport...');
  
  const report = {
    timestamp: new Date().toISOString(),
    branch: 'LYO',
    cleanup: {
      filesRemoved: summary.count,
      spaceFreed: `${summary.sizeMB} MB`,
      status: 'completed'
    },
    recommendations: [
      'Vérifier régulièrement les fichiers inutilisés',
      'Maintenir une nomenclature cohérente',
      'Documenter les assets importants'
    ]
  };
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'CLEANUP_REPORT.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('  ✅ Rapport généré: CLEANUP_REPORT.json');
}

// Exécution principale
async function main() {
  try {
    const allFiles = getAllFiles();
    const referencedFiles = findReferencedFiles();
    const unusedFiles = findUnusedFiles(allFiles, referencedFiles);
    
    if (unusedFiles.length === 0) {
      console.log('✨ Aucun fichier inutilisé détecté !');
      return;
    }
    
    // Mode simulation par défaut
    const dryRun = !process.argv.includes('--execute');
    const summary = removeUnusedFiles(unusedFiles, dryRun);
    
    generateCleanupReport(summary);
    
    if (dryRun) {
      console.log('\n💡 Pour supprimer réellement les fichiers, exécutez:');
      console.log('node scripts/unused-files-cleaner.js --execute');
    } else {
      console.log('\n🎉 Nettoyage terminé avec succès !');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error.message);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { getAllFiles, findReferencedFiles, findUnusedFiles, removeUnusedFiles };