#!/bin/sh
# Sauvegarde quotidienne : base + photos. Cron : 0 3 * * * /chemin/deploy/backup.sh
set -e
cd "$(dirname "$0")/.."
mkdir -p backups
STAMP=$(date +%F)
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U locosis locosis | gzip > "backups/db-$STAMP.sql.gz"
docker run --rm -v locosis_media:/m -v "$PWD/backups":/b alpine tar czf "/b/media-$STAMP.tar.gz" -C /m .
# Garde 14 jours
find backups -type f -mtime +14 -delete
