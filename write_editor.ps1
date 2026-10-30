$targetPath = "c:\Users\Osiel\Documents\Kimi_Agent_Diseño Humanista UI\iaprende\src\pages\CursoEditor.tsx"
$sourcePath = "c:\Users\Osiel\Documents\Kimi_Agent_Diseño Humanista UI\iaprende\editor_content.tsx"
if (Test-Path $sourcePath) {
    Copy-Item $sourcePath $targetPath -Force
    Write-Host "Copied. Size: $((Get-Item $targetPath).Length) bytes"
} else {
    Write-Host "Source not found: $sourcePath"
}
