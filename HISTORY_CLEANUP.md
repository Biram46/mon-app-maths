# Nettoyage après réécriture d'historique

Contexte

Nous avons réécrit l'historique du dépôt pour supprimer des secrets exposés. Cela nécessite que certains contributeurs remettent leurs clones locaux en phase avec le nouveau historique.

Recommandation (meilleure option)

- Re-cloner le dépôt depuis GitHub (méthode la plus simple et la plus sûre) :

```bash
# supprimer ou déplacer l'ancien clone local si tu n'en as plus besoin
rm -rf mon-app-maths
# cloner à nouveau
git clone https://github.com/Biram46/mon-app-maths.git
```

Mise à jour d'un clone existant (avancé)

- Si tu as des modifications locales non poussées, sauvegarde-les d'abord :

```bash
# créer des patches pour garder les changements non poussés
git format-patch origin/main -o ~/my-patches
```

- Pour synchroniser le clone avec le nouveau `main` (attention : ceci écrasera l'état local) :

```bash
git fetch origin --prune
git checkout main
git reset --hard origin/main
git clean -fdx
```

- Si tu avais des branches locales basées sur l'ancien historique, recrée-les depuis `main` et réapplique tes changements ou utilise `git cherry-pick` / `git rebase` si tu maîtrises ces commandes.

Branches de sauvegarde

Nous avons créé des snapshots pour référence :

- `snapshot/before-rollback-20260104-1548`
- `snapshot/before-key-rotation-20260104-1717`

Tu peux les consulter si nécessaire :

```bash
git fetch origin --all
git checkout snapshot/before-key-rotation-20260104-1717
```

Conseils de sécurité

- Révoque et remplace immédiatement toute clé ou token que tu aurais pu exposer localement.
- Ne stocke pas de clés dans le dépôt et ajoute `.env.local` à `.gitignore`.
- Active la 2FA sur les comptes sensibles (GitHub, Vercel, Supabase).

Besoin d'aide ?

Si tu as des doutes ou besoin d'assistance pour récupérer des changements locaux, ouvre une issue et taggue `@Biram46` ou demande de l'aide dans le canal de communication de ton choix.
