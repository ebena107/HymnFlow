param (
    [string]$SourceFolder,
    [string]$OutputFile
)

$Word = New-Object -ComObject Word.Application
$Word.Visible = $false

$Files = Get-ChildItem -Path $SourceFolder -Filter *.doc | Sort-Object Name

"Starting extraction from $SourceFolder to $OutputFile..."

if (Test-Path $OutputFile) { Remove-Item $OutputFile }

foreach ($File in $Files) {
    Write-Host "Processing $($File.Name)..."
    $Doc = $Word.Documents.Open($File.FullName, $false, $true)
    $Text = $Doc.Content.Text
    
    # Append filename as marker and content
    "--- FILE: $($File.Name) ---`r`n" | Out-File -FilePath $OutputFile -Append -Encoding utf8
    $Text | Out-File -FilePath $OutputFile -Append -Encoding utf8
    
    $Doc.Close()
}

$Word.Quit()
Write-Host "Done! Text saved to $OutputFile"
