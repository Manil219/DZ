# Branche LYO - Application lovable.dev

## 📋 Vue d'ensemble

Cette branche LYO est une version synchronisée de l'application lovable.dev depuis la branche main de GitHub. L'application fonctionne sur le port **8080**.

## 🚀 Démarrage rapide

### Option 1: Script automatique (recommandé)
```bash
./start-lyo-dev.sh
```

### Option 2: Commande manuelle
```bash
# Vérifier que vous êtes sur la branche LYO
git checkout LYO

# Installer les dépendances
npm install

# Démarrer l'application
npm run dev
```

L'application sera accessible sur: **http://localhost:8080**

## 🔄 Synchronisation avec la branche main

Pour synchroniser la branche LYO avec les dernières modifications de la branche main :

```bash
./sync-lyo-branch.sh
```

Ce script va :
1. Sauvegarder vos modifications locales
2. Synchroniser avec la branche main
3. Fusionner les changements dans LYO
4. Restaurer vos modifications locales
5. Redémarrer l'application

## 📁 Structure du projet

```
├── src/                    # Code source de l'application
├── public/                 # Fichiers publics statiques
├── supabase/              # Configuration Supabase
├── scripts/               # Scripts utilitaires
├── sync-lyo-branch.sh     # Script de synchronisation
├── start-lyo-dev.sh       # Script de démarrage rapide
└── README_LYO.md          # Ce fichier
```

## 🔧 Configuration

- **Port**: 8080 (configuré dans `vite.config.ts`)
- **Framework**: React + Vite
- **Base de données**: Supabase
- **Styling**: Tailwind CSS

## 📝 Scripts disponibles

| Script | Description |
|--------|-------------|
| `./start-lyo-dev.sh` | Démarrage rapide de l'application |
| `./sync-lyo-branch.sh` | Synchronisation avec la branche main |
| `npm run dev` | Démarrage du serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | Vérification du code |

## 🌐 Accès à l'application

Une fois démarrée, l'application est accessible sur :
- **Local**: http://localhost:8080
- **Réseau**: http://[votre-ip]:8080

## 🔍 Dépannage

### Port 8080 déjà utilisé
```bash
# Arrêter le processus utilisant le port 8080
pkill -f "vite"

# Ou redémarrer avec le script
./start-lyo-dev.sh
```

### Erreurs de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problèmes de synchronisation
```bash
# Forcer la synchronisation
git fetch origin
git reset --hard origin/main
git checkout LYO
git merge main
```

## 📞 Support

Pour toute question ou problème :
1. Vérifiez que vous êtes sur la branche LYO
2. Exécutez le script de synchronisation
3. Consultez les logs de l'application

---

**Dernière synchronisation**: $(date)
**Branche source**: main
**Port**: 8080