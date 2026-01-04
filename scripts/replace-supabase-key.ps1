# Replace Supabase publishable key across text files (skip common binaries)
$old = 'sb_publishable_xxx'
$new = 'sb_publishable_xxx'
$skipExt = @('png','jpg','jpeg','gif','bmp','exe','dll','ico','pdf','zip','woff','woff2','ttf','otf')

Get-ChildItem -Path . -Recurse -File -Force | ForEach-Object {
    $ext = $_.Extension.TrimStart('.').ToLower()
    if ($skipExt -contains $ext) { return }

    $path = $_.FullName
    try {
        $content = Get-Content -Raw -LiteralPath $path -ErrorAction Stop
    } catch {
        return
    }

    if ($null -ne $content -and $content.Contains($old)) {
        $newContent = $content -replace [regex]::Escape($old), $new
        Set-Content -LiteralPath $path -Value $newContent
        Write-Host "Replaced secret in: $path"
    }
}

