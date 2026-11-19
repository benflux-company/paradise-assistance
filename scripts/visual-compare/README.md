# Comparaison visuelle automatique

Compare le site statique de référence (racine du dépôt) et le site Next.js
(`web/`) page par page, à trois tailles d'écran, et calcule le pourcentage
de pixels différents entre les deux captures.

## Utilisation

1. Servir le site statique de référence depuis la racine du dépôt :
   ```bash
   cd ../.. && python3 -m http.server 8090
   ```
2. Lancer le serveur Next.js (dans `web/`) :
   ```bash
   cd ../../web && npm run dev
   ```
3. Installer les dépendances et lancer la comparaison :
   ```bash
   cd scripts/visual-compare
   npm install
   npx playwright install chromium
   node compare.mjs
   ```

Les captures et les images de différence sont écrites dans `out/` (non
versionné). Le résumé chiffré est écrit dans `results.json` (versionné,
sert de trace pour le rapport de vérification final).

## Seuil

Le cahier des charges demande moins de 0,5 % de pixels différents par
capture. Le script signale toute page/taille au-dessus de ce seuil, ou
toute différence de dimensions entre les deux captures.
