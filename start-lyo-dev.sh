#!/bin/bash

# Script de démarrage pour l'application lovable.dev
# Branche LYO - Port 8080

echo "🚀 Démarrage de l'application lovable.dev"
echo "=========================================="
echo "📍 Branche: LYO"
echo "🌐 Port: 8080"
echo ""

# Vérifier si nous sommes sur la branche LYO
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "LYO" ]; then
    echo "⚠️  Vous n'êtes pas sur la branche LYO"
    echo "🔄 Basculement vers la branche LYO..."
    git checkout LYO
    if [ $? -ne 0 ]; then
        echo "❌ Erreur: Impossible de basculer vers la branche LYO"
        echo "💡 Exécutez d'abord: ./sync-lyo-branch.sh"
        exit 1
    fi
fi

echo "✅ Branche LYO active"

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
fi

# Vérifier que le port 8080 est libre
echo "🔍 Vérification du port 8080..."
if lsof -i :8080 >/dev/null 2>&1; then
    echo "⚠️  Le port 8080 est déjà utilisé"
    echo "🔧 Tentative d'arrêt du processus utilisant le port 8080..."
    pkill -f "vite.*8080" || true
    sleep 2
fi

# Vérifier la configuration Vite
if ! grep -q "port: 8080" vite.config.ts; then
    echo "❌ Configuration du port 8080 manquante dans vite.config.ts"
    exit 1
fi

echo "✅ Configuration du port 8080 trouvée"

# Afficher les informations de l'application
echo ""
echo "📱 Information de l'application:"
echo "================================"
echo "🏷️  Nom: $(grep '"name"' package.json | cut -d'"' -f4)"
echo "📝 Description: $(grep '"description"' package.json | cut -d'"' -f4)"
echo "🔢 Version: $(grep '"version"' package.json | cut -d'"' -f4)"
echo ""

# Nettoyer le cache si nécessaire
echo "🧹 Nettoyage du cache..."
rm -rf dist .vite node_modules/.vite 2>/dev/null || true

echo ""
echo "🎯 Démarrage du serveur de développement..."
echo "🌐 L'application sera accessible sur: http://localhost:8080"
echo "🔄 Hot Module Replacement (HMR) activé"
echo ""
echo "⏹️  Pour arrêter le serveur: Ctrl+C"
echo ""

# Démarrer le serveur de développement
npm run dev