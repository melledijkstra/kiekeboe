#!/bin/bash
set -e

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/.."

# Check if the container is running
if [ ! "$(docker ps -q -f name=odysea-n8n)" ]; then
    echo "Error: n8n container (odysea-n8n) is not running."
    echo "Please start n8n first using: pnpm --filter=@odysea/n8n up"
    exit 1
fi

echo "Exporting all workflows to workflows/ directory..."
docker compose exec -T n8n n8n export:workflow --backup --output=/backup/

echo "Backup completed successfully!"
