// Script pour corriger les imports de DocumentViewerModal
const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION DES IMPORTS DocumentViewerModal');
console.log('============================================\n');

const filesToFix = [
  'src/components/DocumentTemplatesSection.tsx',
  'src/components/ProcedureResourcesSection.tsx',
  'src/components/help/AdminGuideSection.tsx',
  'src/components/help/APIDocumentationSection.tsx',
  'src/components/help/UserGuideSection.tsx',
  'src/components/search/ImmersiveSearchInterface.tsx',
  'src/components/ocr/ApprovalWorkflowComponent.tsx',
  'src/components/legal/LegalTextsApprovalQueue.tsx',
  'src/components/procedures/ProceduresApprovalQueue.tsx'
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Corriger l'import
  if (content.includes('import { DocumentViewerModal }')) {
    content = content.replace(
      /import \{ DocumentViewerModal \} from ['"]@\/components\/modals\/DocumentViewerModal['"];?/g,
      'import { UnifiedModalSystem } from \'@/components/modals/UnifiedModalSystem\';'
    );
    modified = true;
  }

  // Corriger les utilisations du composant
  if (content.includes('<DocumentViewerModal')) {
    content = content.replace(
      /<DocumentViewerModal\s+([^>]*)\/>/g,
      (match, props) => {
        // Extraire les props
        const isOpenMatch = props.match(/isOpen=\{([^}]+)\}/);
        const onCloseMatch = props.match(/onClose=\{([^}]+)\}/);
        const documentMatch = props.match(/document=\{([^}]+)\}/);
        
        const isOpen = isOpenMatch ? isOpenMatch[1] : 'false';
        const onClose = onCloseMatch ? onCloseMatch[1] : '() => {}';
        const document = documentMatch ? documentMatch[1] : '{}';
        
        return `<UnifiedModalSystem
          isOpen={${isOpen}}
          onClose={${onClose}}
          config={{
            type: 'viewer',
            title: ${document}.title || 'Document',
            content: ${document}.content || 'Contenu du document',
            document: ${document}
          }}
        />`;
      }
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigé: ${filePath}`);
  } else {
    console.log(`ℹ️  Aucune modification nécessaire: ${filePath}`);
  }
}

// Corriger tous les fichiers
filesToFix.forEach(fixFile);

console.log('\n🎯 CORRECTION TERMINÉE');
console.log('======================');
console.log('✅ Tous les imports DocumentViewerModal ont été corrigés');
console.log('✅ Remplacement par UnifiedModalSystem');
console.log('✅ Configuration adaptée au nouveau système');