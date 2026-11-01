# Audit : ancien site → nouveau site

Référence : l'ancien site https://hanuisibles.fr/ (WordPress, relu par son API publique le 30/10/2026) et le PDF de cahier des charges du client.

## Pages

| | Ancien site | Nouveau site |
| --- | --- | --- |
| Pages | 33 (dont l'index du blog) | 33, mêmes adresses |
| Articles de blog | 39 | 39, mêmes adresses |
| Catégories | 5 | 5, mêmes adresses `/category/.../` |
| Nouvelles pages | — | `/rendez-vous/` (prise de rendez-vous), `/nos-services/`, 404 |
| Total exporté | | 85 pages HTML, 83 URL dans le sitemap |

Aucune adresse ne change : les liens déjà indexés par Google et partagés restent valides.

## Données reprises à l'identique

- Coordonnées : HA Nuisibles / HA Nuisibles 3D (entreprise individuelle, Abdeli Hebbache), 127 cours Tolstoï 69100 Villeurbanne, 07 64 46 46 91, contact@hanuisibles3d.fr, Instagram et Facebook.
- Services et nuisibles : dératisation (rats, souris), désinsectisation (cafards, blattes, fourmis…), punaises de lit, guêpes et frelons, dépigeonnage, désinfection, moustiques, chenilles, araignées, mouches… avec leurs prix quand l'ancien site les donnait.
- Zone : Lyon et ses quartiers, Villeurbanne et ses quartiers, communes voisines, villes de la page Contact (Grenoble, Annecy, Bourg-en-Bresse, Villefranche-sur-Saône, Saint-Étienne, Annemasse), Rhône, Isère, Haute-Savoie.
- Promesses, avis (5★ Google, 16 avis), témoignages, FAQ, mentions légales, hébergeur.
- Photos : les images de l'ancien site (64 fichiers dont le logo), converties en WebP (2 tailles).

## Textes retravaillés

31 pages et les 39 articles ont été réécrits pour la lisibilité et le référencement (titres, intertitres en questions, listes). Un test automatique vérifie que chaque nombre, prix, téléphone et lien de l'ancien texte est conservé et qu'aucun n'est ajouté (`tests/unit/facts.test.ts` ; textes d'origine dans `content/archive/`). Titres et méta-descriptions : 20 requêtes cibles reliées chacune à une page (`content/keywords.json`).

## Décisions

- **Horaires** : l'ancien site se contredisait (« 6J/7 », « 7j/7 », 8h ou 9h, « dimanche urgences uniquement »). Une seule version partout : lundi–vendredi 9h–20h, samedi 9h–18h, dimanche urgences et rendez-vous en ligne (la demande indique 7 jours sur 7).
- **Formulaire de devis** : le PDF prévoyait un envoi par API (Resend), impossible sur un site statique ; Web3Forms est utilisé, avec repli par e-mail prérempli et téléphone.
- **Articles proches** : 5 paires d'articles quasi identiques ont reçu des titres distincts et un lien « À lire aussi » vers l'article principal.
- **Images** : les articles sans photo réutilisent une photo du client sur le même sujet au lieu du logo.
- **Couleurs** : le vert et l'orange ont été légèrement assombris pour un contraste lisible (accessibilité WCAG AA).

## À confirmer par le client

1. **E-mail** : contact@hanuisibles3d.fr (mentions légales) alors que le domaine est hanuisibles.fr ; l'ancien site affichait aussi hanuisibles3d@gmail.com.
2. **« Disponible 24h/24 »** sur la page Dératisation à Lyon : promesse de l'ancien site, conservée ; à retirer si elle ne correspond plus.
3. **Droits des images** : `wmremove-transformed.webp` (nom évoquant un filigrane retiré) et les photos `*-unsplash*` ; l'image `deratisation-obligation.webp` contient une coquille (« DÉRATISATIION »).

## Non reproduit

- La recherche interne de l'ancien site (WordPress) : remplacée par le menu des services et les catégories du blog.
- Les pages techniques de WordPress (flux RSS, auteurs, pages d'archive par date).
