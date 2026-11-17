# Atelier Locosis

Site vitrine + back-office (CRM) — Next.js + Payload CMS + PostgreSQL.

## Dev local

```sh
cp .env.example .env
docker compose up -d          # Postgres (5433) + Mailpit (http://localhost:8025)
pnpm install
pnpm payload migrate
pnpm seed                     # données de démo + admin admin@locosis.local / changeme-locosis
pnpm dev                      # http://localhost:3000 — admin : /admin
```

Après modification d'une collection : `pnpm payload migrate:create <nom>` puis commit du fichier généré dans `src/migrations/`.

## Production (VPS)

Prérequis : Docker + plugin compose, ports 80/443 ouverts, DNS `A` du domaine (et `www`) vers l'IP du VPS.
Caddy gère HTTPS (Let's Encrypt) automatiquement.

### Première mise en ligne

```sh
git clone <repo> locosis && cd locosis
cp .env.prod.example .env.prod
# Remplir .env.prod — secrets : openssl rand -hex 32
alias dc='docker compose -f docker-compose.prod.yml --env-file .env.prod'
dc up -d --build              # migrations appliquées automatiquement avant l'app
```

### Accès admin au CRM

Un compte par personne. Mot de passe généré et affiché une seule fois :

```sh
dc run --rm -e ADMIN_EMAIL=frere@exemple.fr -e ADMIN_NAME="Prénom" migrate pnpm seed:admin
dc run --rm -e ADMIN_EMAIL=moi@exemple.fr   -e ADMIN_NAME="Noah"   migrate pnpm seed:admin
```

- Compte existant → ignoré. Réinitialiser : ajouter `-e ADMIN_RESET=1`.
- Mot de passe imposé : `-e ADMIN_PASSWORD=…` (12 caractères min.). Évite l'historique shell : préférer la génération.
- Ensuite chacun change son mot de passe dans `/admin` → compte. « Mot de passe oublié » marche si le SMTP est configuré.
- Données de démo (optionnel, premier lancement seulement) : `dc run --rm migrate pnpm seed`.

### Mise à jour

```sh
git pull && dc up -d --build
```

### Sauvegardes

`deploy/backup.sh` : dump Postgres + archive des photos dans `backups/`, rotation 14 jours.

```sh
crontab -e
0 3 * * * /chemin/vers/locosis/deploy/backup.sh
```

Restauration base : `gunzip -c backups/db-AAAA-MM-JJ.sql.gz | dc exec -T postgres psql -U locosis locosis`
Copier `backups/` hors du VPS de temps en temps (rsync, rclone…).

### Utile

```sh
dc logs -f app                # logs
dc ps                         # état
dc exec postgres psql -U locosis locosis
```
