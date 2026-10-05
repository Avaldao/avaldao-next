#!/bin/bash

set -e

USER=deploy
HOST=avaldao
APP_DIR=/home/deploy/avaldao
RELEASE_DIR="$APP_DIR/releases/$(date +%s)"

echo "Building..."
npm run build

echo "Creating remote release dir..."
ssh $USER@$HOST "mkdir -p $RELEASE_DIR"

echo "Deploying standalone build..."

# 1. El standalone (server.js, .next/server, node_modules, package.json)
rsync -az --info=progress2 .next/standalone/ $USER@$HOST:$RELEASE_DIR/

# 2. Static assets DENTRO de .next/
rsync -az --info=progress2 .next/static/ $USER@$HOST:$RELEASE_DIR/.next/static/

# 3. Public como carpeta separada
rsync -az --info=progress2 public/ $USER@$HOST:$RELEASE_DIR/public/

echo "Switching current symlink..."

ssh $USER@$HOST << EOF
  ln -sfn $RELEASE_DIR $APP_DIR/current
EOF

echo "Restarting PM2..."
ssh $USER@$HOST "export NVM_DIR=\$HOME/.nvm; . \$NVM_DIR/nvm.sh; cd $APP_DIR/current && pm2 restart avaldao || pm2 start $APP_DIR/ecosystem.config.js"

echo "Done → $RELEASE_DIR"