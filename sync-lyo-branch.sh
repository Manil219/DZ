#!/bin/bash

# Script de synchronisation de la branche LYO
# Application lovable.dev - Port 8080

echo "🚀 Script de synchronisation de la branche LYO"
echo "=============================================="

# Vérifier si nous sommes dans un dépôt Git
if [ ! -d ".git" ]; then
    echo "❌ Erreur: Ce dossier n'est pas un dépôt Git"
    exit 1
fi

# Sauvegarder la branche actuelle
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Branche actuelle: $CURRENT_BRANCH"

# Fonction pour créer la branche LYO si elle n'existe pas
create_lyo_branch() {
    echo "🔧 Création de la branche LYO..."
    git checkout main
    git pull origin main
    git checkout -b LYO
    echo "✅ Branche LYO créée avec succès"
}

# Vérifier si la branche LYO existe
if git branch | grep -q "LYO"; then
    echo "✅ La branche LYO existe déjà"
    
    # Synchroniser avec main
    echo "🔄 Synchronisation avec la branche main..."
    git checkout main
    git pull origin main
    
    echo "🔄 Basculement vers la branche LYO..."
    git checkout LYO
    
    echo "🔄 Merge des modifications de main vers LYO..."
    git merge main --no-ff -m "Synchronisation avec main - $(date)"
    
else
    echo "⚠️  La branche LYO n'existe pas"
    create_lyo_branch
fi

# Vérifier les dossiers critiques
echo "🔍 Vérification des dossiers critiques..."
CRITICAL_DIRS=("src" "public" "supabase" "scripts")

for dir in "${CRITICAL_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ Dossier $dir: OK"
    else
        echo "⚠️  Dossier $dir: MANQUANT"
    fi
done

# Vérifier les fichiers de configuration
echo "🔍 Vérification des fichiers de configuration..."
CONFIG_FILES=("package.json" "vite.config.ts" "tailwind.config.ts" "tsconfig.json")

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Fichier $file: OK"
    else
        echo "⚠️  Fichier $file: MANQUANT"
    fi
done

# Vérifier la configuration du port 8080
echo "🔍 Vérification de la configuration du port 8080..."
if grep -q "port: 8080" vite.config.ts; then
    echo "✅ Port 8080 configuré dans vite.config.ts"
else
    echo "⚠️  Configuration du port 8080 non trouvée"
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Afficher le statut final
echo ""
echo "📊 Statut de synchronisation:"
echo "=============================="
git status

echo ""
echo "🎯 Branche LYO synchronisée avec succès!"
echo "🌐 Pour démarrer l'application sur le port 8080:"
echo "   npm run dev"
echo ""
echo "🔧 Pour pousser la branche LYO vers le dépôt distant:"
echo "   git push origin LYO"