#!/bin/sh
# Remplace la clef Supabase dans les fichiers connus
FILES="config.js index.html admin.html"
for f in $FILES; do
  if [ -f "$f" ]; then
    # Utilise PowerShell pour remplacer en toute sécurité (Windows)
    powershell -NoProfile -Command "try { $c = Get-Content -Raw -LiteralPath '$f' -ErrorAction Stop; $nc = $c -replace 'sb_publishable_xxx', 'sb_publishable_xxx'; if ($nc -ne $c) { Set-Content -LiteralPath '$f' -Value $nc; Write-Host 'Replaced in $f' } } catch { }"
  fi
done

