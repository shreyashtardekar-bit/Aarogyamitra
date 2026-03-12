$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/token" -Method Post -Body "username=admin&password=admin123"
$token = $response.access_token

try {
    Invoke-WebRequest -Uri "http://127.0.0.1:8000/workout/history" -Headers @{Authorization="Bearer $token"}
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    Write-Output "WORKOUT ERROR:"
    $reader.ReadToEnd()
}

try {
    Invoke-WebRequest -Uri "http://127.0.0.1:8000/meals/history" -Headers @{Authorization="Bearer $token"}
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    Write-Output "MEALS ERROR:"
    $reader.ReadToEnd()
}
