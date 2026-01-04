// Configuration centralisée pour l'application Robot Maths
// NOTE: Ne stockez pas de secrets privés ici. Préférez l'injection d'env côté build/déploiement.
// Si votre plateforme injecte les variables d'environnement au runtime via `window.__ENV`, elles seront priorisées.
const DEFAULT_CONFIG = {
    SUPABASE_URL: window.__ENV?.NEXT_PUBLIC_SUPABASE_URL || "https://fhpfpnlkcvhxotbblzps.supabase.co",
    SUPABASE_KEY: window.__ENV?.NEXT_PUBLIC_SUPABASE_KEY || "sb_publishable_xxx"
};

// Respecter une config déjà injectée (par déploiement) sinon exposer DEFAULT_CONFIG
window.APP_CONFIG = window.APP_CONFIG || DEFAULT_CONFIG;
