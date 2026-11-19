# Ets Paradise Assistance — site Next.js

Migration du site vitrine statique (`index.html` à la racine du dépôt) vers
Next.js, avec base de données, API et espace d'administration.

## Installation locale

```bash
npm install
cp .env.example .env   # puis complète les valeurs (voir ci-dessous)
```

### Base de données

Le site a besoin d'une base PostgreSQL. En local, le plus simple est un
conteneur Docker :

```bash
docker run -d --name paradise-pg \
  -e POSTGRES_USER=paradise -e POSTGRES_PASSWORD=paradise -e POSTGRES_DB=paradise_assistance \
  -p 5432:5432 postgres:15-alpine
```

Mets à jour `DATABASE_URL` dans `.env` si tu utilises un port ou des
identifiants différents, puis applique les migrations et le seed :

```bash
npx prisma migrate dev
npx prisma db seed
```

Le seed importe tout le contenu actuel du site (projets, articles, services,
étapes, FAQ, diaporama du hero) depuis `lib/data.ts`, et crée le compte
administrateur à partir de `ADMIN_EMAIL` / `ADMIN_PASSWORD` dans `.env`.

### Lancer le site

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Voir `.env.example` pour la liste complète et commentée. En résumé :

- `DATABASE_URL` — connexion PostgreSQL.
- `SESSION_SECRET` — secret de session pour l'administration (`openssl rand -hex 32`).
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — compte créé par le seed.
- `SMTP_*` / `MAIL_FROM` — envoi des e-mails du formulaire de contact.
- `PUBLIC_SITE_URL` — utilisée pour le sitemap, les métadonnées et les liens dans les e-mails.
- `CLOUDINARY_URL` / `CLOUDINARY_FOLDER` — stockage des images et de la vidéo envoyées depuis l'administration.

## Commandes utiles

```bash
npm run dev          # serveur de développement
npm run build         # build de production
npm run lint          # ESLint
npx prisma studio      # interface d'exploration de la base
npx prisma migrate dev  # nouvelle migration après modification du schéma
npx prisma db seed      # relancer le seed (upsert, sans dupliquer)
```

## Vérification visuelle

`scripts/visual-compare/` (à la racine du dépôt) compare automatiquement le
rendu du site statique de référence et du site Next.js. Voir son propre
README pour l'utilisation.

## Déploiement

Préparation Docker/Helm à venir (étape 10 du cahier des charges) —
hébergement prévu sur le cluster Benflux, sous-domaine `benfluxgroup.com` en
attendant l'achat du nom de domaine définitif.
