# Guide de Synchronisation - Branche LYO

## 🎯 Objectif
Ce guide décrit la synchronisation des dossiers de l'application lovable.dev depuis la branche `main` vers la nouvelle branche `LYO` avec configuration du port 8080.

## 📋 Vue d'ensemble

### Branches
- **main** : Branche principale du projet
- **LYO** : Nouvelle branche de développement avec optimisations

### Configuration
- **Port de développement** : 8080
- **Application** : lovable.dev (Dalil.dz)
- **Framework** : React + Vite + TypeScript

## 🛠️ Scripts de Synchronisation

### 1. Script de Synchronisation (`sync-lyo-branch.sh`)
```bash
./sync-lyo-branch.sh
```

**Fonctionnalités :**
- ✅ Création automatique de la branche LYO si inexistante
- 🔄 Synchronisation avec la branche main
- 🔍 Vérification des dossiers critiques
- 📦 Installation des dépendances si nécessaire
- ⚙️ Validation de la configuration du port 8080

### 2. Script de Démarrage (`start-lyo-dev.sh`)
```bash
./start-lyo-dev.sh
```

**Fonctionnalités :**
- 🚀 Démarrage automatique sur la branche LYO
- 🌐 Serveur de développement sur le port 8080
- 🔧 Vérification et nettoyage des processus en conflit
- 📱 Affichage des informations de l'application

## 📁 Structure des Dossiers Synchronisés

### Dossiers Critiques
```
src/                    # Code source principal
├── components/         # Composants React
├── pages/             # Pages de l'application
├── services/          # Services et API
├── stores/            # État global (Zustand)
├── styles/            # Styles CSS
├── utils/             # Utilitaires
├── hooks/             # Hooks personnalisés
├── types/             # Types TypeScript
├── data/              # Données statiques
├── lib/               # Bibliothèques
├── i18n/              # Internationalisation
└── integrations/      # Intégrations externes

public/                # Assets statiques
├── api/               # APIs mockées
├── forms/             # Formulaires
├── guides/            # Guides utilisateur
└── lovable-uploads/   # Uploads Lovable

supabase/              # Configuration base de données
├── migrations/        # Migrations SQL
└── config.toml        # Configuration Supabase

scripts/               # Scripts de build et déploiement
```

### Fichiers de Configuration
- `package.json` - Dépendances et scripts
- `vite.config.ts` - Configuration Vite (port 8080)
- `tailwind.config.ts` - Configuration TailwindCSS
- `tsconfig.json` - Configuration TypeScript
- `components.json` - Configuration des composants UI

## 🔧 Configuration du Port 8080

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      port: 8080,
      overlay: false,
      clientPort: 8080,
    }
  }
});
```

### Scripts NPM
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 🚀 Procédure de Synchronisation

### Étape 1 : Synchronisation Initiale
```bash
# Exécuter le script de synchronisation
./sync-lyo-branch.sh
```

### Étape 2 : Démarrage de l'Application
```bash
# Démarrer l'application sur le port 8080
./start-lyo-dev.sh
```

### Étape 3 : Accès à l'Application
- **URL de développement** : http://localhost:8080
- **HMR** : Activé pour les mises à jour à chaud
- **Console** : Surveillance des logs en temps réel

## 📊 Vérifications de Synchronisation

### Dossiers Vérifiés
- [x] `src/` - Code source principal
- [x] `public/` - Assets statiques
- [x] `supabase/` - Configuration BDD
- [x] `scripts/` - Scripts de build

### Fichiers Vérifiés
- [x] `package.json` - Dépendances
- [x] `vite.config.ts` - Configuration Vite
- [x] `tailwind.config.ts` - Configuration CSS
- [x] `tsconfig.json` - Configuration TypeScript

### Ports Vérifiés
- [x] Port 8080 - Configuration Vite
- [x] HMR Port 8080 - Hot Module Replacement

## 🔄 Synchronisation Continue

### Synchronisation Manuelle
```bash
# Synchroniser avec main
git checkout main
git pull origin main
git checkout LYO
git merge main --no-ff -m "Sync with main"
```

### Automatisation
Le script `sync-lyo-branch.sh` automatise ce processus et peut être exécuté régulièrement.

## 📝 Logs et Monitoring

### Commandes de Diagnostic
```bash
# Vérifier l'état Git
git status

# Voir les différences avec main
git diff main

# Historique des commits
git log --oneline -10

# Processus sur le port 8080
lsof -i :8080
```

## 🛠️ Résolution de Problèmes

### Port 8080 Occupé
```bash
# Identifier le processus
lsof -i :8080

# Arrêter le processus
pkill -f "vite.*8080"
```

### Conflits de Merge
```bash
# Résoudre les conflits manuellement
git status
# Éditer les fichiers en conflit
git add .
git commit -m "Resolve merge conflicts"
```

### Dépendances Manquantes
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## ✅ Validation de la Synchronisation

La synchronisation est considérée comme réussie quand :

1. ✅ La branche LYO existe et est à jour avec main
2. ✅ Tous les dossiers critiques sont présents
3. ✅ La configuration du port 8080 est active
4. ✅ L'application démarre sans erreur
5. ✅ L'interface est accessible sur http://localhost:8080

## 📞 Support

Pour toute question ou problème de synchronisation :
1. Vérifier les logs des scripts
2. Consulter la documentation Git
3. Examiner les fichiers de configuration Vite

---
*Guide créé pour la synchronisation de l'application lovable.dev - Branche LYO*