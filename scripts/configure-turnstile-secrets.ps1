param(
  [string]$ProjectRef = "avfzuudrjnglqrkyxwkz"
)

$ErrorActionPreference = "Stop"
$temporaryEnvFile = Join-Path $env:TEMP "neuropsiedu-turnstile-$PID.env"
$secretPointer = [IntPtr]::Zero

try {
  Write-Host ""
  Write-Host "Configuração segura do Cloudflare Turnstile no Supabase" -ForegroundColor Cyan
  Write-Host "Projeto: $ProjectRef"
  Write-Host ""

  $secureSecret = Read-Host "Cole a TURNSTILE_SECRET_KEY (entrada mascarada)" -AsSecureString
  $secretPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureSecret)
  $turnstileSecret = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretPointer)

  if ([string]::IsNullOrWhiteSpace($turnstileSecret)) {
    throw "A secret key não pode ficar vazia."
  }

  $saltBytes = New-Object byte[] 48
  $random = [Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $random.GetBytes($saltBytes)
  }
  finally {
    $random.Dispose()
  }

  $rateLimitSalt = [BitConverter]::ToString($saltBytes).Replace("-", "").ToLowerInvariant()
  $secretLines = @(
    "TURNSTILE_SECRET_KEY=$turnstileSecret"
    "TURNSTILE_EXPECTED_ACTION=lead_formacao"
    "TURNSTILE_ALLOWED_HOSTNAMES=neuropsiedu.com.br,www.neuropsiedu.com.br"
    "RATE_LIMIT_SALT=$rateLimitSalt"
  )

  Set-Content -LiteralPath $temporaryEnvFile -Value $secretLines -Encoding UTF8

  Write-Host ""
  Write-Host "Enviando os segredos ao Supabase..." -ForegroundColor Yellow
  & npx.cmd --yes supabase@latest secrets set `
    --env-file $temporaryEnvFile `
    --project-ref $ProjectRef

  if ($LASTEXITCODE -ne 0) {
    throw "A CLI do Supabase retornou o código $LASTEXITCODE."
  }

  Write-Host ""
  Write-Host "Segredos configurados. Confirmando apenas os nomes..." -ForegroundColor Green
  & npx.cmd --yes supabase@latest secrets list --project-ref $ProjectRef
}
catch {
  Write-Host ""
  Write-Host "Falha: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
  if (Test-Path -LiteralPath $temporaryEnvFile) {
    Remove-Item -LiteralPath $temporaryEnvFile -Force
  }

  if ($secretPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPointer)
  }

  $turnstileSecret = $null
  $rateLimitSalt = $null
  $secureSecret = $null

  Write-Host ""
  Read-Host "Pressione Enter para fechar"
}
