# HA Nuisibles — site web

Nouveau site de HA Nuisibles (dératisation, désinsectisation, nuisibles à Lyon, Villeurbanne et en Rhône-Alpes) : tous les contenus de l'ancien site https://hanuisibles.fr/, retravaillés pour le référencement, avec la prise de rendez-vous en ligne (Cal.com relié à Google Agenda, une durée par service, du lundi au samedi et le dimanche en urgence), un hub des zones d'intervention, les avis clients et des statistiques sans cookies (facultatives).

## Stack

- Next.js 16 (App Router) en **export statique** (`output: "export"`, `trailingSlash: true`) : un dossier de fichiers HTML/CSS/JS, sans serveur Node.
- Tailwind CSS 4 (couleurs et échelle typographique dans le `@theme` de `src/app/globals.css`), polices Instrument Serif (titres) et Poppins (texte), auto-hébergées via @fontsource, icônes Lucide ; animations en CSS seulement, coupées si `prefers-reduced-motion`.
- Contenus en Markdown dans `content/pages/` et `content/posts/` ; données de l'entreprise (téléphone, adresse, horaires, zone) dans `src/config/site.ts`, une seule source.
- Formulaire de devis envoyé par Web3Forms (pas de back-end) ; rendez-vous sur `/rendez-vous/` : choix du service, puis agenda Cal.com chargé seulement après le clic (le service choisi est gardé dans l'adresse `#service`, les boutons des pages de service le présélectionnent).
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
| `NEXT_PUBLIC_SITE_URL` | URL publique (liens canoniques, sitemap). Défaut : `https://www.ha-nuisibles.fr` (ne jamais mettre hanuisibles.fr, domaine parqué) |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Clé d'accès Web3Forms du formulaire de devis. Sans clé, le formulaire propose un e-mail prérempli et le téléphone |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Domaine déclaré dans Plausible (statistiques sans cookies). Vide : aucun script chargé |
| `NEXT_PUBLIC_ANALYTICS_SRC` | Facultatif : URL du script d'une instance Plausible auto-hébergée |
| `NEXT_PUBLIC_GOOGLE_REVIEW_URL` | Lien « Demander des avis » de la fiche Google Business Profile. Vide : pas de bouton « Laisser un avis » |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Code de vérification Search Console (méthode « balise HTML »). Vide : pas de balise |

Ces variables sont lues **au moment du build** : après un changement, relancer `bash tools/deliver.sh`.

## Mise en ligne sur Hostinger

1. `bash tools/deliver.sh` (avec la clé Web3Forms dans `.env.local` ou l'environnement).
2. Dans hPanel → Gestionnaire de fichiers (ou FTP), vider `public_html/` puis y envoyer **tout le contenu** de `deliverable/`, y compris le fichier caché `.htaccess`.
3. Le `.htaccess` force HTTPS et le domaine sans `www`, ajoute la barre finale aux anciennes adresses tapées sans elle (`/contact` → `/contact/`) et sert `404.html` pour les pages inconnues. Activer le certificat SSL dans hPanel.
4. Vérifier : la page d'accueil, `/rendez-vous/` (l'agenda s'affiche), l'envoi d'un devis, `https://www.ha-nuisibles.fr/sitemap.xml`.

Les adresses de l'ancien site WordPress sont conservées à l'identique (`/deratisation-lyon-2/`, articles, catégories `/category/.../`) : le référencement acquis n'est pas perdu.

## Avis clients

Les avis affichés sur l'accueil et les pages de service sont dans `content/reviews.json` : ajouter chaque nouvel avis Google en tête de liste (texte et prénom exacts, jamais d'avis inventé) et mettre à jour la note et le nombre d'avis. Les 3 premiers sont visibles, les suivants sous « Voir plus d'avis ». Pas de balisage `aggregateRating` (Google l'ignore pour un avis publié par l'entreprise elle-même). Puis relancer `bash tools/deliver.sh`.

## Statistiques de visite

Statistiques **sans cookies** (Plausible : pas de bannière nécessaire). Créer le site dans Plausible, mettre son domaine dans `NEXT_PUBLIC_ANALYTICS_DOMAIN`, relancer `bash tools/deliver.sh` et renvoyer `deliverable/`.

Lire les chiffres dans le tableau de bord Plausible : visiteurs, pages vues, provenance (Google, fiche Google Business, sites), pages les plus vues. Dans **Goals**, ajouter ces événements personnalisés (envoyés par le site) pour suivre les demandes :

| Événement | Quand | Détail |
| --- | --- | --- |
| `Appel` | clic sur un numéro de téléphone | `page` : page d'où vient l'appel |
| `Prendre rendez-vous` | clic sur un bouton « Prendre rendez-vous » | `page` |
| `Choix service` | choix du problème sur `/rendez-vous/` | `service` |
| `Devis envoyé` | devis envoyé avec succès | `service`, `source` (réponse à « Comment nous avez-vous connus ? » : Fiche Google, Recherche Google, Bouche-à-oreille, Autre) |

Le ratio *Devis envoyé + Appel* / visiteurs donne le taux de contact ; la propriété `page` montre quelles pages font appeler.

**Ce que les chiffres ne disent pas.** Un événement `Appel` est un *clic* sur un numéro, pas un appel abouti (sur ordinateur, le clic n'appelle souvent pas). Pour compter les vrais appels, un numéro de suivi est possible (facultatif, payant). Les vrais rendez-vous se comptent dans Cal.com (Bookings → exporter en CSV), à comparer chaque mois aux clics `Prendre rendez-vous`.

### Liens de la fiche Google Business Profile

Pour distinguer dans Plausible les visites venues de la fiche Google de celles de la recherche, mettre dans la fiche des liens balisés (le site les lit sans rien changer) :

- Site web : `https://www.ha-nuisibles.fr/?utm_source=google&utm_medium=gbp`
- Bouton « Réserver » / lien de rendez-vous : `https://www.ha-nuisibles.fr/rendez-vous/?utm_source=google&utm_medium=gbp`

Dans Plausible : Sources → *google* / support *gbp*. La réponse `source` du formulaire de devis recoupe ces chiffres.

### Changement de nom de domaine

Le domaine n'est écrit qu'à un endroit : `NEXT_PUBLIC_SITE_URL` (sinon `site.url` dans `src/config/site.ts`). Si le domaine définitif change :

1. Mettre la nouvelle adresse dans `NEXT_PUBLIC_SITE_URL`, relancer `bash tools/deliver.sh` : sitemap, canonicals, JSON-LD et `robots.txt` suivent.
2. Vérifier `deliverable/sitemap.xml` et la balise canonical d'une page.
3. Si l'ancien domaine `hanuisibles.fr` reste actif : redirection 301 de toutes ses pages vers les mêmes chemins du nouveau domaine (dans son `.htaccess`).
4. Search Console : ajouter la nouvelle propriété, soumettre le sitemap, puis « Changement d'adresse » depuis l'ancienne.
5. Plausible : renommer le site (ou en créer un) et mettre le domaine dans `NEXT_PUBLIC_ANALYTICS_DOMAIN`.
6. Mettre à jour les liens de la fiche Google Business Profile et des annuaires.

## Google Search Console et Bing — suivi après la mise en ligne

Le site est en ligne sur `https://www.ha-nuisibles.fr`. À faire une fois, dans cet ordre :

1. **Search Console** : ajouter la propriété « Domaine » `ha-nuisibles.fr` (couvre avec et sans `www` ; vérification par enregistrement DNS chez le registraire, ou par « balise HTML » : coller le code dans `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` puis relancer `bash tools/deliver.sh`).
2. **Sitemap** : Sitemaps → soumettre `https://www.ha-nuisibles.fr/sitemap.xml`. Le statut doit passer à « Opération effectuée » avec environ 100 URL découvertes.
3. **Bing Webmaster Tools** : « Importer depuis Google Search Console » (reprend la propriété et le sitemap), sinon ajouter le site et soumettre le même sitemap.
4. **Demandes d'indexation** (Inspection d'URL → « Demander l'indexation », quelques-unes par jour) : accueil, `/nos-services/`, `/tarifs/`, `/deratisation-lyon-2/`, `/deratisation-villeurbanne/`, `/entreprise-punaises-de-lit-lyon/`, `/desinsectisation-lyon-2/`, `/destruction-nid-guepes-frelons/`, `/nid-guepes-frelons-lyon/`, `/depigeonnage/`, `/zones-d-intervention/`, `/avis/`.
5. **Fiche Google Business Profile** : même nom, adresse, téléphone que le site ; lien du site avec `?utm_source=google&utm_medium=gbp` (voir plus haut).
6. **Ancien domaine `hanuisibles.fr`** (si le client y a accès) : redirection 301 de chaque page vers le même chemin sur `https://www.ha-nuisibles.fr` (règle `.htaccess` : `RewriteRule ^(.*)$ https://www.ha-nuisibles.fr/$1 [R=301,L]`), puis « Changement d'adresse » dans la Search Console de l'ancienne propriété.

**Après 2 à 4 semaines, dans « Performances »** (Search Console, 28 derniers jours, onglet Requêtes puis Pages) :
- **Impressions** qui montent sur les requêtes « métier + ville » (dératisation Lyon, punaises de lit Villeurbanne…) : Google a compris les pages. Les clics viennent ensuite.
- **Position moyenne** entre 8 et 20 sur une requête : la page est proche de la première page ; c'est là qu'un avis, un cas réel ou une photo de plus aide le plus.
- **CTR faible (< 2 %) avec beaucoup d'impressions** : réécrire le titre ou la description de la page concernée (`content/`), garder le mot-clé en tête.
- **Une requête qui affiche deux pages différentes** : signaler la page voulue (la carte des requêtes est dans `content/keywords.json`).
- **Pages → « Non indexée »** : lire le motif ; « Explorée, actuellement non indexée » sur une page locale = il lui faut plus de contenu réel (cas, photos).
- À exporter chaque mois (bouton « Exporter ») pour comparer avec les rendez-vous Cal.com et les devis.

## Réimporter l'ancien site

`npm run import:wp` relit l'API WordPress de l'ancien site (cache dans `.cache/wp/`) et réécrit `content/` et `public/images/`. **Attention** : cela écrase les textes retravaillés ; à n'utiliser que pour récupérer un contenu manquant, puis comparer avec `git diff`. En cas d'arrêt en cours de route : `git checkout -- content public/images`.

## Structure

```
src/app/          pages (accueil, services, blog, contact, rendez-vous, mentions légales, 404)
src/components/   en-tête, pied de page, barre mobile, formulaire, assistant de réservation, FAQ, ui/ (blocs éditoriaux)
src/config/       site.ts (coordonnées, horaires, zone), navigation, accueil
src/lib/          lecture du Markdown, SEO (métadonnées, JSON-LD), formulaire
content/          pages et articles (Markdown), keywords.json (mot-clé → page)
public/           images de l'ancien site (WebP), .htaccess
tools/            import-wp.mjs (import WordPress), deliver.sh (livraison)
tests/            unit/, e2e/, audit SEO, budgets
```
