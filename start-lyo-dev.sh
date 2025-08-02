#!/bin/bash

# Script de démarrage rapide pour l'application LYO
# Port 8080 - Application lovable.dev

echo "🚀 Démarrage de l'application LYO..."
echo "====================================="

# Vérifier que nous sommes sur la branche LYO
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "LYO" ]; then
    echo "⚠️  Vous n'êtes pas sur la branche LYO (branche actuelle: $CURRENT_BRANCH)"
    echo "🔄 Basculement vers la branche LYO..."
    git checkout LYO
fi

# Vérifier les dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Arrêter le serveur s'il tourne déjà
echo "🛑 Arrêt du serveur existant..."
pkill -f "vite" || true

# Démarrer l'application
echo "🚀 Démarrage de l'application sur le port 8080..."
echo "🌐 L'application sera accessible sur: http://localhost:8080"
echo "⏳ Démarrage en cours..."

npm run dev