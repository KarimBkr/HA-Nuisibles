# Guide de test — site HA Nuisibles

## Lancer le site

- **Version livrée** : servir le dossier `deliverable/` tel quel, par exemple `npx serve deliverable -l 8080` puis ouvrir http://localhost:8080 (ou l'envoyer sur Hostinger, voir README.md).
- **Développement** : `npm install` puis `npm run dev` → http://localhost:3000.

## À tester à la main (mobile d'abord, puis ordinateur)

1. **Accueil** : téléphone visible en haut, bouton « Prendre rendez-vous », barre fixe « Appeler / Prendre rendez-vous » en bas sur mobile.
2. **Appel direct** : sur un téléphone, « Appeler » ouvre le composeur avec le 07 64 46 46 91.
3. **Trouver son problème** : menu (burger sur mobile) → Dératisation, Punaises de lit, Guêpes & frelons… chaque page a son titre, ses prix, sa FAQ dépliable et ses boutons d'action.
4. **Prendre rendez-vous** (`/rendez-vous/`) : choisir un service, l'agenda Cal.com de ce service s'affiche avec la bonne durée (dératisation 4 h, punaises 5 h, guêpes 1 h…) ; réserver un créneau test, vérifier qu'il apparaît dans Google Agenda et que les autres services perdent ces heures, puis l'annuler. Le lien « Ouvrir l'agenda dans un nouvel onglet » fonctionne.
5. **Devis** (`/contact/#mon-devis`) : envoyer le formulaire vide (messages d'erreur, curseur sur le premier champ), puis un vrai devis : message de succès et e-mail reçu sur la boîte liée à Web3Forms.
6. **Blog** (`/conseils-nuisibles/`) : filtres par catégorie, articles avec photo, liens vers les pages de service.
7. **Adresses de l'ancien site** : `/deratisation-lyon-2/`, `/contact` (sans barre finale → redirigé), une adresse inconnue → page 404 avec liens utiles.
8. **Référencement** : `/sitemap.xml` et `/robots.txt` s'affichent ; tester une page dans https://search.google.com/test/rich-results (entreprise locale, FAQ, fil d'Ariane).
9. **Vitesse** : https://pagespeed.web.dev/ sur l'accueil et une page de service une fois en ligne.

## Paramètres de la réservation (côté client)

Sur Cal.com (compte `ha-nuisibles`, relié à Google Agenda) : un type de rendez-vous par service, avec la durée la plus longue de l'intervention (dératisation 4 h, punaises de lit 5 h, désinsectisation 2 h, guêpes et frelons 1 h, démoustication 4 h, dépigeonnage 4 h, désinfection 5 h, urgence dimanche 4 h). Les adresses sont `cal.com/ha-nuisibles/<service>` ; les réglages se font chez Cal.com, le site affiche simplement ces pages.

## Tests automatiques

`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e`.
