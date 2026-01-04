# Rotation des clés — 2026-01-04

**Résumé**

Une clé sensible a été exposée publiquement. Par précaution, nous avons immédiatement révoqué la clé exposée, regénéré les clés critiques (service_role et publishable), et mis à jour les variables d'environnement sur Vercel. Ce document résume les actions effectuées et les étapes pour les contributeurs.

---

## Actions effectuées (par l'équipe)

- Révocation immédiate des clés exposées (tokens postés publiquement).
- Regénération de la **Service Role** (Supabase) et de la **clé publishable (anon)**.
- Mise à jour des variables d'environnement sur Vercel (`SUPABASE_SERVICE_ROLE`, `NEXT_PUBLIC_SUPABASE_KEY`) en production.
- Déclenchement d'un redeploy sur Vercel et vérification de `/api/env`.
- Tests effectués : lecture publique (table `levels`) et vérification d'un flux basique (login). Résultats : OK.
- Branches de sauvegarde (snapshots) créées :
  - `snapshot/before-key-rotation-20260104-1717` (état avant rotation)
  - (autres sauvegardes antérieures : `snapshot/before-rollback-20260104-1548`)

---

## Impact & actions requises pour les contributeurs

- **Si tu as des tokens ou secrets locaux** : révoque et remplace immédiatement les tokens que tu aurais pu exposer.
- **Si tu as cloné le dépôt avant la dernière réécriture d'historique** : suis la procédure décrite dans `HISTORY_CLEANUP.md` (re-clone recommandé pour être sûr).
- **Vérifie tes environnements locaux** : ne commit pas de `.env.local` contenant des clés, ajoute‑le à `.gitignore` si ce n'est pas déjà fait.
- **Pour les CI / Integrations** : vérifie que vos secrets côté CI (actions, scripts, etc.) ont été mis à jour et ne contiennent plus d'anciennes clés.

---

## Recommandations de sécurité

- N'envoie **jamais** de clés en clair dans des conversations publiques ou des issues.
- Active la **2FA** sur les comptes critiques (GitHub, Vercel, Supabase).
- Utilise un gestionnaire de mots de passe/secret manager pour partager temporairement les accès si besoin.
- Rotations : si une clé a été exposée, considère la rotation de toutes les clés associées par précaution.

---

## Contact & suivi

- Si tu as des questions, signale‑les ici (ou ouvre une issue) et tagge `@Biram46`.
- Je peux créer une issue récapitulative et une PR contenant ce fichier pour transparence — dis‑moi si tu veux que je le crée maintenant (je peux ouvrir la PR et l'issue sur GitHub si tu me donnes un accès temporaire, ou je peux pousser la branche et te fournir les liens pour ouvrir la PR/issue).

---

Merci d'avoir agi rapidement — la sécurité est une priorité.
