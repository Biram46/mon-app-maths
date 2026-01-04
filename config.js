// Configuration centralisée pour l'application Robot Maths
// NOTE: Ne stockez pas de secrets privés ici. Nous chargeons maintenant les valeurs
// publiques au runtime depuis un endpoint sécurisé `/api/env` afin que les variables
// Vercel soient utilisées sans les commiter dans le dépôt.
(function () {
    function fetchConfigSync() {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/env', false); // synchronisé volontairement pour l'initialisation
            xhr.send(null);
            if (xhr.status === 200) {
                var cfg = JSON.parse(xhr.responseText);
                window.APP_CONFIG = window.APP_CONFIG || {
                    SUPABASE_URL: cfg.SUPABASE_URL || "https://fhpfpnlkcvhxotbblzps.supabase.co",
                    SUPABASE_KEY: cfg.SUPABASE_KEY || "sb_publishable_xxx"
                };
                return;
            }
        } catch (e) {
            // ignore and fall back to defaults
        }

        // Fallback to defaults if endpoint is unavailable
        window.APP_CONFIG = window.APP_CONFIG || {
            SUPABASE_URL: "https://fhpfpnlkcvhxotbblzps.supabase.co",
            SUPABASE_KEY: "sb_publishable_xxx"
        };
    }

    fetchConfigSync();
})();
