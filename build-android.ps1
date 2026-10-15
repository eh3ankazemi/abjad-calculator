param(
  [switch]$Release
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

  $javaCompiler = if ([string]::IsNullOrWhiteSpace($env:JAVA_HOME)) {
    (Get-Command 'javac' -ErrorAction SilentlyContinue).Source
  } else {
    Join-Path $env:JAVA_HOME 'bin\javac.exe'
  }
  $javaMajorVersion = 0
  if ($javaCompiler -and (Test-Path -LiteralPath $javaCompiler -PathType Leaf)) {
    $javaVersionOutput = & $javaCompiler -version 2>&1
    if ($javaVersionOutput -match 'javac\s+(\d+)') {
      $javaMajorVersion = [int]$Matches[1]
    }
  }

  if ($javaMajorVersion -lt 21) {
    $androidStudioJavaHome = 'C:\Program Files\Android\Android Studio\jbr'
    $androidStudioJavaCompiler = Join-Path $androidStudioJavaHome 'bin\javac.exe'
    if (Test-Path -LiteralPath $androidStudioJavaCompiler -PathType Leaf) {
      $javaVersionOutput = & $androidStudioJavaCompiler -version 2>&1
      if ($javaVersionOutput -match 'javac\s+(\d+)' -and [int]$Matches[1] -ge 21) {
        $env:JAVA_HOME = $androidStudioJavaHome
        $env:Path = (Join-Path $androidStudioJavaHome 'bin') + ';' + $env:Path
        $javaMajorVersion = [int]$Matches[1]
        Write-Host ('Using Android Studio JDK ' + $javaMajorVersion + '.') -ForegroundColor Green
      }
    }
  }

  if ($javaMajorVersion -lt 21) {
    throw 'Android builds require JDK 21 or newer. Set JAVA_HOME to a JDK 21 installation and run this script again.'
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

  Write-Host 'نسخهٔ وب آفلاین ساخته و داخل APK بسته‌بندی می‌شود.' -ForegroundColor Green

  Invoke-Step 'bun' @('run', 'build')

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
  $apkCandidates = if ($Release) {
    @((Join-Path $apkDirectory 'app-release.apk'))
  } else {
    @((Join-Path $apkDirectory 'app-debug.apk'))
  }
  $apkPath = $apkCandidates | Where-Object {
    Test-Path -LiteralPath $_
  } | Select-Object -First 1

  if ($apkPath) {
    if ($Release) {
      $downloadPath = Join-Path $projectRoot 'public\downloads\abjad-calculator.apk'
      Copy-Item -LiteralPath $apkPath -Destination $downloadPath -Force
      Write-Host 'APK انتشار برای دانلود مستقیم به‌روزرسانی شد:' -ForegroundColor Green
      Write-Host $downloadPath
    }

    Write-Host ''
    Write-Host 'APK آماده شد:' -ForegroundColor Green
    Write-Host $apkPath
  } else {
    if ($Release) {
      throw ('APK انتشار امضاشده ساخته نشد یا در مسیر مورد انتظار پیدا نشد: ' + $apkDirectory)
    }
    throw ('APK ساخته نشد یا در مسیر مورد انتظار پیدا نشد: ' + $apkDirectory)
  }
}
finally {
  Pop-Location
}
