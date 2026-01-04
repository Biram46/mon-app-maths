/**
 * Gestionnaire de ressources pour mon-app-maths
 * Gère l'upload et la récupération de fichiers depuis Supabase Storage
 * Organisation : lycee/{niveau}/{chapitre}/{type}/{fichier}
 * 
 * @requires config.js (pour le client Supabase)
 */

// Configuration du bucket Supabase
const BUCKET_NAME = 'ressources-lycee';

/**
 * Normalise un nom de chapitre en slug (URL-friendly)
 * @param {string} chapitre - Nom du chapitre
 * @returns {string} - Slug normalisé
 */
function slugify(chapitre) {
  return chapitre
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/\s+/g, '-')              // espaces -> tirets
    .replace(/[^a-z0-9-]/g, '');       // garde uniquement lettres, chiffres, tirets
}

/**
 * Construit le chemin complet dans le bucket
 * @param {string} niveau - seconde | premiere | terminale
 * @param {string} chapitre - nom du chapitre
 * @param {string} type - cours | exercices
 * @param {string} fileName - nom du fichier
 * @returns {string} - Chemin complet
 */
function buildPath(niveau, chapitre, type, fileName) {
  const slugChapitre = slugify(chapitre);
  return `${niveau}/${slugChapitre}/${type}/${fileName}`;
}

/**
 * Upload un fichier vers Supabase Storage
 * @param {File} file - Fichier à uploader
 * @param {string} niveau - Niveau scolaire
 * @param {string} chapitre - Nom du chapitre
 * @param {string} type - Type de ressource (cours/exercices)
 * @param {string} ext - Extension du fichier (tex, docx, pdf)
 * @returns {Promise<{success: boolean, path?: string, error?: string}>}
 */
async function uploadRessource(file, niveau, chapitre, type, ext) {
  if (!file) {
    return { success: false, error: 'Aucun fichier fourni' };
  }

  const slugChapitre = slugify(chapitre);
  const fileName = `${slugChapitre}_${type}.${ext}`;
  const path = buildPath(niveau, chapitre, type, fileName);

  try {
    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true // écrase si existe déjà
      });

    if (error) {
      console.error('Erreur upload Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true, path: data.path };
  } catch (err) {
    console.error('Erreur lors de l\'upload:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Upload multiple fichiers (tex, docx, pdf) pour une ressource
 * @param {Object} files - { tex: File, docx: File, pdf: File }
 * @param {string} niveau - Niveau scolaire
 * @param {string} chapitre - Nom du chapitre
 * @param {string} type - Type de ressource
 * @returns {Promise<{success: boolean, results: Array, errors: Array}>}
 */
async function uploadMultipleRessources(files, niveau, chapitre, type) {
  const results = [];
  const errors = [];

  const formats = [
    { key: 'tex', ext: 'tex' },
    { key: 'docx', ext: 'docx' },
    { key: 'pdf', ext: 'pdf' }
  ];

  for (const format of formats) {
    const file = files[format.key];
    if (file) {
      const result = await uploadRessource(file, niveau, chapitre, type, format.ext);
      if (result.success) {
        results.push({ format: format.ext, path: result.path });
      } else {
        errors.push({ format: format.ext, error: result.error });
      }
    }
  }

  return {
    success: errors.length === 0,
    results,
    errors
  };
}

/**
 * Récupère l'URL publique d'un fichier
 * @param {string} niveau - Niveau scolaire
 * @param {string} chapitre - Nom du chapitre
 * @param {string} type - Type de ressource
 * @param {string} ext - Extension du fichier
 * @returns {string} - URL publique
 */
function getPublicUrl(niveau, chapitre, type, ext) {
  const slugChapitre = slugify(chapitre);
  const fileName = `${slugChapitre}_${type}.${ext}`;
  const path = buildPath(niveau, chapitre, type, fileName);

  const { data } = supabase
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Récupère toutes les URLs pour un chapitre (cours + exercices, tous formats)
 * @param {string} niveau - Niveau scolaire
 * @param {string} chapitre - Nom du chapitre
 * @returns {Object} - URLs organisées par type et format
 */
function getAllUrls(niveau, chapitre) {
  const types = ['cours', 'exercices'];
  const formats = ['tex', 'docx', 'pdf'];
  const urls = {};

  types.forEach(type => {
    urls[type] = {};
    formats.forEach(ext => {
      urls[type][ext] = getPublicUrl(niveau, chapitre, type, ext);
    });
  });

  return urls;
}

/**
 * Liste tous les fichiers d'un dossier
 * @param {string} niveau - Niveau scolaire
 * @param {string} chapitre - Nom du chapitre (optionnel)
 * @param {string} type - Type de ressource (optionnel)
 * @returns {Promise<Array>} - Liste des fichiers
 */
async function listFiles(niveau, chapitre = null, type = null) {
  let prefix = niveau;
  if (chapitre) {
    const slugChapitre = slugify(chapitre);
    prefix += `/${slugChapitre}`;
    if (type) {
      prefix += `/${type}`;
    }
  }

  try {
    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .list(prefix);

    if (error) {
      console.error('Erreur listing:', error);
      return [];
    }

    return data;
  } catch (err) {
    console.error('Erreur lors du listing:', err);
    return [];
  }
}

/**
 * Supprime un fichier
 * @param {string} niveau - Niveau scolaire
 * @param {string} chapitre - Nom du chapitre
 * @param {string} type - Type de ressource
 * @param {string} ext - Extension du fichier
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function deleteRessource(niveau, chapitre, type, ext) {
  const slugChapitre = slugify(chapitre);
  const fileName = `${slugChapitre}_${type}.${ext}`;
  const path = buildPath(niveau, chapitre, type, fileName);

  try {
    const { error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Erreur suppression:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Erreur lors de la suppression:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Initialisation de l'interface d'upload dans admin.html
 * @param {string} formId - ID du formulaire d'upload
 */
function initUploadForm(formId) {
  const form = document.getElementById(formId);
  if (!form) {
    console.error(`Formulaire ${formId} introuvable`);
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Récupère les valeurs du formulaire
    const niveau = document.getElementById('niveau')?.value;
    const chapitre = document.getElementById('chapitre')?.value;
    const type = document.getElementById('type')?.value;

    if (!niveau || !chapitre || !type) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Récupère les fichiers
    const files = {
      tex: document.getElementById('file-tex')?.files[0],
      docx: document.getElementById('file-docx')?.files[0],
      pdf: document.getElementById('file-pdf')?.files[0]
    };

    // Vérifie qu'au moins un fichier est sélectionné
    if (!files.tex && !files.docx && !files.pdf) {
      alert('Veuillez sélectionner au moins un fichier');
      return;
    }

    // Désactive le bouton pendant l'upload
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Upload en cours...';

    try {
      // Upload les fichiers
      const result = await uploadMultipleRessources(files, niveau, chapitre, type);

      // Affiche les résultats
      if (result.success) {
        alert(`✓ Upload réussi !\n${result.results.length} fichier(s) uploadé(s)`);
        form.reset();
      } else {
        let message = 'Upload terminé avec des erreurs :\n';
        result.errors.forEach(err => {
          message += `- ${err.format}: ${err.error}\n`;
        });
        if (result.results.length > 0) {
          message += `\n${result.results.length} fichier(s) uploadé(s) avec succès`;
        }
        alert(message);
      }
    } catch (err) {
      console.error('Erreur upload:', err);
      alert('Erreur lors de l\'upload : ' + err.message);
    } finally {
      // Réactive le bouton
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Export des fonctions pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    slugify,
    buildPath,
    uploadRessource,
    uploadMultipleRessources,
    getPublicUrl,
    getAllUrls,
    listFiles,
    deleteRessource,
    initUploadForm
  };
}
