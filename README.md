# HA Nuisibles — site web

Nouveau site de HA Nuisibles (dératisation, désinsectisation, nuisibles à Lyon, Villeurbanne et en Rhône-Alpes) : tous les contenus de l'ancien site https://hanuisibles.fr/, retravaillés pour le référencement, avec la prise de rendez-vous en ligne (Cal.com relié à Google Agenda, une durée par service, 7 jours sur 7).

## Stack

- Next.js 16 (App Router) en **export statique** (`output: "export"`, `trailingSlash: true`) : un dossier de fichiers HTML/CSS/JS, sans serveur Node.
- Tailwind CSS 4, police Poppins (auto-hébergée via @fontsource), icônes Lucide.
- Contenus en Markdown dans `content/pages/` et `content/posts/` ; données de l'entreprise (téléphone, adresse, horaires, zone) dans `src/config/site.ts`, une seule source.
- Formulaire de devis envoyé par Web3Forms (pas de back-end) ; rendez-vous par l'agenda de réservation Google intégré sur `/rendez-vous/`.
- Tests : Vitest (unitaires, audit SEO, budgets de poids), Playwright (parcours, accessibilité axe-core).

## Commandes

```bash
npm install
npm run dev         # développement sur http://localhost:3000
npm run build       # export statique dans out/
npm run lint && npm run typecheck && npm test && npm run e2e
bash tools/deliver.sh   # build de production + copie dans deliverable/ (exige la clé Web3Forms)
```

## Variables d'environnement

Voir `.env.example` (à copier en `.env.local`, jamais commité) :

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (liens canoniques, sitemap). Défaut : `https://hanuisibles.fr` |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Clé d'accès Web3Forms du formulaire de devis. Sans clé, le formulaire propose un e-mail prérempli et le téléphone |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Domaine déclaré dans Plausible (statistiques sans cookies). Vide : aucun script chargé |
| `NEXT_PUBLIC_ANALYTICS_SRC` | Facultatif : URL du script d'une instance Plausible auto-hébergée |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Code de vérification Search Console (méthode « balise HTML »). Vide : pas de balise |

Ces variables sont lues **au moment du build** : après un changement, relancer `bash tools/deliver.sh`.

## Mise en ligne sur Hostinger

1. `bash tools/deliver.sh` (avec la clé Web3Forms dans `.env.local` ou l'environnement).
2. Dans hPanel → Gestionnaire de fichiers (ou FTP), vider `public_html/` puis y envoyer **tout le contenu** de `deliverable/`, y compris le fichier caché `.htaccess`.
3. Le `.htaccess` force HTTPS et le domaine sans `www`, ajoute la barre finale aux anciennes adresses tapées sans elle (`/contact` → `/contact/`) et sert `404.html` pour les pages inconnues. Activer le certificat SSL dans hPanel.
4. Vérifier : la page d'accueil, `/rendez-vous/` (l'agenda s'affiche), l'envoi d'un devis, `https://hanuisibles.fr/sitemap.xml`.

Les adresses de l'ancien site WordPress sont conservées à l'identique (`/deratisation-lyon-2/`, articles, catégories `/category/.../`) : le référencement acquis n'est pas perdu.

## Statistiques de visite

Statistiques **sans cookies** (Plausible : pas de bannière nécessaire). Créer le site dans Plausible, mettre son domaine dans `NEXT_PUBLIC_ANALYTICS_DOMAIN`, relancer `bash tools/deliver.sh` et renvoyer `deliverable/`.

Lire les chiffres dans le tableau de bord Plausible : visiteurs, pages vues, provenance (Google, fiche Google Business, sites), pages les plus vues. Dans **Goals**, ajouter ces événements personnalisés (envoyés par le site) pour suivre les demandes :

| Événement | Quand | Détail |
| --- | --- | --- |
| `Appel` | clic sur un numéro de téléphone | `page` : page d'où vient l'appel |
| `Prendre rendez-vous` | clic sur un bouton « Prendre rendez-vous » | `page` |
| `Choix service` | choix du problème sur `/rendez-vous/` | `service` |
| `Devis envoyé` | devis envoyé avec succès | `service` |

Le ratio *Devis envoyé + Appel* / visiteurs donne le taux de contact ; la propriété `page` montre quelles pages font appeler.

## Google Search Console

1. Ajouter la propriété `https://hanuisibles.fr` (vérification par enregistrement DNS chez le registraire, ou par « balise HTML » : coller le code dans `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` puis relancer `bash tools/deliver.sh`).
2. Sitemaps → soumettre `sitemap.xml`.
3. Inspection d'URL → demander l'indexation de l'accueil et des pages de service principales.
4. Relier la fiche Google Business Profile au site (même nom, adresse, téléphone).

## Réimporter l'ancien site

`npm run import:wp` relit l'API WordPress de l'ancien site (cache dans `.cache/wp/`) et réécrit `content/` et `public/images/`. **Attention** : cela écrase les textes retravaillés ; à n'utiliser que pour récupérer un contenu manquant, puis comparer avec `git diff`. En cas d'arrêt en cours de route : `git checkout -- content public/images`.

## Structure

```
src/app/          pages (accueil, services, blog, contact, rendez-vous, mentions légales, 404)
src/components/   en-tête, pied de page, barre mobile, formulaire, agenda, FAQ…
src/config/       site.ts (coordonnées, horaires, zone), navigation, accueil
src/lib/          lecture du Markdown, SEO (métadonnées, JSON-LD), formulaire
content/          pages et articles (Markdown), keywords.json (mot-clé → page)
public/           images de l'ancien site (WebP), .htaccess
tools/            import-wp.mjs (import WordPress), deliver.sh (livraison)
tests/            unit/, e2e/, audit SEO, budgets
```
