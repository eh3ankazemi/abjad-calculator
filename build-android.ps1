param(
  [switch]$Release,
  [string]$ServerUrl
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$androidRoot = Join-Path $projectRoot 'android'

function Invoke-Step {
  param(
    [string]$Command,
    [string[]]$Arguments
  )

  Write-Host ''
  Write-Host ('> ' + $Command + ' ' + ($Arguments -join ' ')) -ForegroundColor Cyan
  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw ('Command failed with exit code ' + $LASTEXITCODE + ': ' + $Command)
  }
}

Push-Location $projectRoot
try {
  $releaseSigningVariables = @(
    'ANDROID_RELEASE_KEYSTORE',
    'ANDROID_RELEASE_STORE_PASSWORD',
    'ANDROID_RELEASE_KEY_ALIAS',
    'ANDROID_RELEASE_KEY_PASSWORD'
  )
  foreach ($name in $releaseSigningVariables) {
    if ([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($name, 'Process'))) {
      $userValue = [Environment]::GetEnvironmentVariable($name, 'User')
      if (-not [string]::IsNullOrWhiteSpace($userValue)) {
        [Environment]::SetEnvironmentVariable($name, $userValue, 'Process')
      }
    }
  }

  if ($Release) {
    $missingSigningVariables = @($releaseSigningVariables | Where-Object { [string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($_, 'Process')) })
    if ($missingSigningVariables.Count -gt 0) {
      throw ('برای ساخت APK انتشار باید تنظیمات کلید انتشار را در متغیرهای محیطی وارد کنید: ' + ($missingSigningVariables -join ', '))
    }
    if (-not (Test-Path -LiteralPath $env:ANDROID_RELEASE_KEYSTORE -PathType Leaf)) {
      throw 'فایل کلید انتشار در مسیر ANDROID_RELEASE_KEYSTORE پیدا نشد.'
    }
  }

  if (-not [string]::IsNullOrWhiteSpace($ServerUrl)) {
    try {
      [System.Uri]$parsedServerUrl = $ServerUrl
      if ($parsedServerUrl.Scheme -notin @('http', 'https') -or [string]::IsNullOrWhiteSpace($parsedServerUrl.Host)) {
        throw 'invalid URL'
      }
    }
    catch {
      throw ('ServerUrl نامعتبر است: ' + $ServerUrl)
    }

    $env:CAPACITOR_SERVER_URL = $ServerUrl.TrimEnd('/')
    $env:CAPACITOR_ALLOW_CLEARTEXT = if ($parsedServerUrl.Scheme -eq 'http') { 'true' } else { 'false' }

    if ($parsedServerUrl.Host -eq 'localhost' -or $parsedServerUrl.Host -eq '127.0.0.1') {
      Write-Warning 'در Android، localhost به خود دستگاه اشاره می‌کند. برای Emulator از 10.0.2.2:3000 و برای گوشی واقعی از IP شبکه‌ی کامپیوتر استفاده کنید.'
    }
  } else {
    Remove-Item Env:CAPACITOR_SERVER_URL -ErrorAction SilentlyContinue
    Remove-Item Env:CAPACITOR_ALLOW_CLEARTEXT -ErrorAction SilentlyContinue
    Write-Host 'نشانی پیش‌فرض سایت در پیکربندی اندروید استفاده می‌شود.' -ForegroundColor Yellow
  }

  if (-not (Test-Path -LiteralPath $androidRoot -PathType Container)) {
    Invoke-Step 'bunx' @('cap', 'add', 'android')
  }

  Invoke-Step 'bunx' @('cap', 'sync', 'android')

  Push-Location $androidRoot
  try {
    $gradleTask = if ($Release) { 'assembleRelease' } else { 'assembleDebug' }
    Invoke-Step '.\gradlew.bat' @($gradleTask)
  }
  finally {
    Pop-Location
  }

  $variant = if ($Release) { 'release' } else { 'debug' }
  $apkDirectory = Join-Path $androidRoot ('app\build\outputs\apk\' + $variant)
  $apkCandidates = @(
    (Join-Path $apkDirectory ('app-' + $variant + '.apk')),
    (Join-Path $apkDirectory ('app-' + $variant + '-unsigned.apk'))
  )
  $apkPath = $apkCandidates | Where-Object {
    Test-Path -LiteralPath $_
  } | Select-Object -First 1

  if ($apkPath) {
    if ($Release) {
      $downloadPath = Join-Path $projectRoot 'public\downloads\estelameram.apk'
      Copy-Item -LiteralPath $apkPath -Destination $downloadPath -Force
      Write-Host 'APK انتشار برای دانلود مستقیم به‌روزرسانی شد:' -ForegroundColor Green
      Write-Host $downloadPath
    }

    Write-Host ''
    Write-Host 'APK آماده شد:' -ForegroundColor Green
    Write-Host $apkPath
  } else {
    throw ('APK ساخته نشد یا در مسیر مورد انتظار پیدا نشد: ' + $apkDirectory)
  }
}
finally {
  Pop-Location
}
