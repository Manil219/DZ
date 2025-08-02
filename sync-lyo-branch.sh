#!/bin/bash

# Script de synchronisation pour la branche LYO
# Synchronise avec la branche main et redémarre l'application

echo "🔄 Début de la synchronisation de la branche LYO..."

# Sauvegarder les modifications locales si elles existent
if ! git diff-index --quiet HEAD --; then
    echo "📝 Sauvegarde des modifications locales..."
    git stash push -m "Sauvegarde avant synchronisation LYO"
    STASH_CREATED=true
fi

# Basculer sur la branche main
echo "🔄 Basculement sur la branche main..."
git checkout main

# Synchroniser avec le repository distant
echo "🔄 Synchronisation avec origin/main..."
git pull origin main

# Basculer sur la branche LYO
echo "🔄 Basculement sur la branche LYO..."
git checkout LYO

# Fusionner les changements de main dans LYO
echo "🔄 Fusion des changements de main dans LYO..."
git merge main

# Restaurer les modifications locales si elles existaient
if [ "$STASH_CREATED" = true ]; then
    echo "📝 Restauration des modifications locales..."
    git stash pop
fi

# Installer les dépendances si nécessaire
echo "📦 Vérification des dépendances..."
npm install

# Arrêter le serveur de développement s'il tourne
echo "🛑 Arrêt du serveur de développement..."
pkill -f "vite" || true

# Redémarrer l'application
echo "🚀 Redémarrage de l'application sur le port 8080..."
npm run dev &

# Attendre que l'application démarre
echo "⏳ Attente du démarrage de l'application..."
sleep 5

# Vérifier que l'application fonctionne
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
    echo "✅ Synchronisation réussie !"
    echo "🌐 Application accessible sur: http://localhost:8080"
    echo "📋 Branche actuelle: $(git branch --show-current)"
else
    echo "❌ Erreur lors du démarrage de l'application"
    exit 1
fi