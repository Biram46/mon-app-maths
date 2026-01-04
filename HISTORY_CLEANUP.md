# Nettoyage d'historique — mon-app-maths

J'ai nettoyé l'historique du dépôt pour retirer une **valeur sensible** (clé publishable Supabase) qui apparaissait dans plusieurs commits.

Ce qui a été fait :

- La clé a été remplacée par un placeholder dans tout l'historique (`sb_publishable_xxx`).
- Le dépôt distant (`main`) a été **mis à jour par force-push** pour refléter l'historique nettoyé.

IMPORTANT : ceci réécrit l'historique Git. Si vous avez un clone local du dépôt, suivez ces étapes **précautionneuses** :

Option recommandée (plus simple) — re-cloner :

1. Sauvegardez les fichiers non committés en dehors du dossier du dépôt local (copie du répertoire ou patch).
2. Re-clonez le dépôt :

```
git clone https://github.com/Biram46/mon-app-maths.git
```

Option avancée — conserver un clone et réaligner (si vous avez des branches locales) :

1. Sauvegardez vos changements locaux :

```
git checkout -b my-local-backup
```

2. Mettre à jour les références et réaligner :

```
git fetch origin --prune
# Pour remplacer l'historique local de main
git checkout main
git reset --hard origin/main
```

3. Puis rebase ou appliquer vos changements de `my-local-backup` sur l'arbre mis à jour.

----

Si vous avez des questions ou avez besoin d'aide pour migrer vos branches locales, dites-le-moi et je vous guiderai pas-à-pas.

Remarque : même si la clé supprimée est une clé "publishable" (publique/anon), il est recommandé de la **regénérer** (rotation) si vous avez des doutes sur l'exposition antérieure.
