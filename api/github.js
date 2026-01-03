/**
 * API Vercel pour interagir avec GitHub de manière sécurisée.
 * Cette fonction s'exécute côté serveur.
 */
export default async function handler(req, res) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: "Le token GitHub n'est pas configuré sur le serveur Vercel." });
    }

    const { action, owner, repo, path, content, message } = req.body;

    try {
        if (action === 'saveFile') {
            // Logique pour sauvegarder un fichier sur GitHub
            // On utilise le GITHUB_TOKEN caché ici
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message || "Upload via Robot Maths API",
                    content: btoa(content), // Encodage base64 pour l'API GitHub
                })
            });

            const data = await response.json();
            return res.status(response.status).json(data);
        }

        res.status(400).json({ error: "Action non supportée." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
