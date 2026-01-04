# mon-app-maths

Petit projet web pour apprendre les mathématiques avec un back-end léger Supabase.

## Variables d'environnement

- Copiez `.env.local.example` en `.env.local` pour le développement local :

```
cp .env.local.example .env.local
```

- Remplissez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_KEY` avec vos valeurs.
- Ne commitez jamais `.env.local` dans le dépôt. Il est listé dans `.gitignore`.

## Déploiement

- Configurez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_KEY` dans la plateforme de déploiement (Vercel / Netlify / GitHub Actions secrets).
- `config.js` priorise aujourd'hui les variables injectées via `window.__ENV` si votre plateforme les expose au runtime, sinon il tombe sur une valeur par défaut.

## Remarque sécurité

- Les clés `NEXT_PUBLIC_*` sont des clés publishable/anon pour Supabase (pas des secrets privés), mais évitez de stocker des clés privées côté client.
- Si `.env.local` a déjà été poussé publiquement, il faudra nettoyer l'historique Git (BFG/git filter-repo). Contactez-moi si vous voulez que je vous aide à le faire.
