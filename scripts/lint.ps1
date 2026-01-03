Param(
  [switch]$Fix,
  [switch]$InstallMissing
)

$ErrorActionPreference = 'Continue'

# Block: paths
$RepoRoot = Split-Path -Parent $PSScriptRoot
$ReportsDir = Join-Path $RepoRoot 'reports'
$TerraformRoot = Join-Path $RepoRoot 'terraform-modules'

# Block: ensure reports folder exists
New-Item -ItemType Directory -Force -Path $ReportsDir | Out-Null

# Block: timestamped report files
$Timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$TerraformFmtReport = Join-Path $ReportsDir "terraform-fmt-$Timestamp.txt"
$TerraformValidateReport = Join-Path $ReportsDir "terraform-validate-$Timestamp.txt"
$TflintReport = Join-Path $ReportsDir "tflint-$Timestamp.txt"
$RuffReport = Join-Path $ReportsDir "ruff-$Timestamp.txt"
$InstallReport = Join-Path $ReportsDir "install-$Timestamp.txt"
$SummaryReport = Join-Path $ReportsDir "summary-$Timestamp.txt"

# Block: initialize summary (so later sections can append without being overwritten)
"Reports written to: $ReportsDir" | Set-Content -Path $SummaryReport

# Block: initialize install report
"Install output (if any):" | Set-Content -Path $InstallReport

function Write-Section {
  param(
    [string]$Path,
    [string]$Title
  )
  Add-Content -Path $Path -Value "`n==== $Title ====`n"
}

function Has-Command {
  param([string]$Name)
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Install-ToolWithWinget {
  param(
    [string]$PackageId,
    [string]$ReportPath
  )

  # Block: winget installer
  if (-not (Has-Command 'winget')) {
    Add-Content -Path $ReportPath -Value "winget not found in PATH; cannot install $PackageId"
    return
  }

  Add-Content -Path $ReportPath -Value "Attempting install via winget: $PackageId"

  # Note: winget is interactive unless these flags are provided.
  winget install --id $PackageId --accept-source-agreements --accept-package-agreements 2>&1 |
    Tee-Object -FilePath $ReportPath -Append
}

function Update-SessionPath {
  # Block: refresh current PowerShell session PATH after installers modify the machine PATH.
  # This avoids requiring a shell restart.
  try {
    $MachinePath = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $UserPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    $env:Path = "$MachinePath;$UserPath"
  }
  catch {
    # Best effort; continue.
  }
}

function Install-RuffTool {
  param(
    [string]$ReportPath
  )

  # Block: ruff installer
  if (Has-Command 'ruff') {
    Add-Content -Path $ReportPath -Value "ruff already available"
    return
  }

  if (-not (Has-Command 'python')) {
    Add-Content -Path $ReportPath -Value "python not found in PATH; cannot install ruff via pip"
    return
  }

  Add-Content -Path $ReportPath -Value "Attempting install via pip: ruff"
  python -m pip install --user ruff 2>&1 | Tee-Object -FilePath $ReportPath -Append
}

# Block: optional dependency installation
# This script never installs tools unless you pass -InstallMissing.
if ($InstallMissing) {
  Write-Section -Path $SummaryReport -Title 'tool installation'

  Add-Content -Path $SummaryReport -Value "Installer output: $InstallReport"

  if (-not (Has-Command 'terraform')) {
    Install-ToolWithWinget -PackageId 'Hashicorp.Terraform' -ReportPath $InstallReport
  }

  if (-not (Has-Command 'tflint')) {
    # Common winget ID is TerraformLinters.TFLint.
    Install-ToolWithWinget -PackageId 'TerraformLinters.TFLint' -ReportPath $InstallReport
  }

  if (-not (Has-Command 'ruff')) {
    Install-RuffTool -ReportPath $InstallReport
  }

  Update-SessionPath

  # Block: re-check availability after attempted installs
  Add-Content -Path $SummaryReport -Value "`nTool availability after install attempt:"
  Add-Content -Path $SummaryReport -Value "- terraform: $([bool](Has-Command 'terraform'))"
  Add-Content -Path $SummaryReport -Value "- tflint: $([bool](Has-Command 'tflint'))"
  Add-Content -Path $SummaryReport -Value "- ruff: $([bool](Has-Command 'ruff'))"
}

# Block: Terraform fmt (repo-wide)
if (Has-Command 'terraform') {
  Write-Section -Path $TerraformFmtReport -Title 'terraform fmt'

  if ($Fix) {
    terraform fmt -recursive $TerraformRoot 2>&1 | Tee-Object -FilePath $TerraformFmtReport -Append
  }
  else {
    terraform fmt -check -diff -recursive $TerraformRoot 2>&1 | Tee-Object -FilePath $TerraformFmtReport -Append
  }
}
else {
  "terraform not found in PATH" | Set-Content -Path $TerraformFmtReport
}

# Block: Terraform validate (per module)
# Note: validate requires provider plugins, so we run `terraform init -backend=false`.
if (Has-Command 'terraform') {
  Write-Section -Path $TerraformValidateReport -Title 'terraform validate'

  $ModuleDirs = Get-ChildItem -Path $TerraformRoot -Directory -Recurse |
    Where-Object {
      (Test-Path (Join-Path $_.FullName 'versions.tf')) -or
        ((Get-ChildItem $_.FullName -Filter '*.tf' -ErrorAction SilentlyContinue | Measure-Object).Count -gt 0)
    }

  foreach ($Dir in $ModuleDirs) {
    $TfFiles = Get-ChildItem -Path $Dir.FullName -Filter '*.tf' -ErrorAction SilentlyContinue
    if (-not $TfFiles) { continue }

    Add-Content -Path $TerraformValidateReport -Value "`n-- $($Dir.FullName) --"

    $ChdirPath = $Dir.FullName
    terraform -chdir="$ChdirPath" init -backend=false -input=false 2>&1 | Tee-Object -FilePath $TerraformValidateReport -Append
    terraform -chdir="$ChdirPath" validate -no-color 2>&1 | Tee-Object -FilePath $TerraformValidateReport -Append
  }
}
else {
  "terraform not found in PATH" | Set-Content -Path $TerraformValidateReport
}

# Block: tflint (optional)
if (Has-Command 'tflint') {
  Write-Section -Path $TflintReport -Title 'tflint'

  # Initialize plugins (e.g., tflint-ruleset-aws) based on .tflint.hcl.
  # This is required before running tflint when config references plugins.
  tflint --init --chdir $TerraformRoot --config (Join-Path $RepoRoot '.tflint.hcl') 2>&1 |
    Tee-Object -FilePath $TflintReport -Append

  # Run recursively within terraform-modules only.
  # This avoids scanning non-Terraform folders (e.g. reports/, scripts/) which can cause noise.
  tflint --recursive --chdir $TerraformRoot --config (Join-Path $RepoRoot '.tflint.hcl') 2>&1 |
    Tee-Object -FilePath $TflintReport -Append
}
else {
  "tflint not found in PATH (optional)" | Set-Content -Path $TflintReport
}

# Block: ruff (Python lint)
if (Has-Command 'ruff') {
  Write-Section -Path $RuffReport -Title 'ruff'

  if ($Fix) {
    ruff check $TerraformRoot --fix 2>&1 | Tee-Object -FilePath $RuffReport -Append
  }
  else {
    ruff check $TerraformRoot 2>&1 | Tee-Object -FilePath $RuffReport -Append
  }
}
else {
  "ruff not found in PATH" | Set-Content -Path $RuffReport
}

# Block: summary (append report file paths)
"- $TerraformFmtReport" | Add-Content -Path $SummaryReport
"- $TerraformValidateReport" | Add-Content -Path $SummaryReport
"- $TflintReport" | Add-Content -Path $SummaryReport
"- $RuffReport" | Add-Content -Path $SummaryReport
"- $InstallReport" | Add-Content -Path $SummaryReport

Write-Host "Done. See $SummaryReport"
