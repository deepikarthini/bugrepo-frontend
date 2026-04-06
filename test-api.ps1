# Bug Reproduction Recorder - API Test Script
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Bug Reproduction Recorder - API Testing" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api"

# Test 1: Login
Write-Host "1. Testing Login..." -ForegroundColor Yellow
try {
    $loginBody = @{email='dev@example.com'; password='password123'} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType 'application/json' -UseBasicParsing
    $loginData = $response.Content | ConvertFrom-Json
    $token = $loginData.token
    Write-Host "Success! User: $($loginData.fullName) ($($loginData.role))" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test 2: Get All Bugs
Write-Host "2. Getting All Bugs..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/bugs" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    $bugs = $response.Content | ConvertFrom-Json
    Write-Host "Success! Retrieved $($bugs.Count) bugs" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Bug by ID (if bugs exist)
if ($bugs.Count -gt 0) {
    $bugId = $bugs[0].id
    Write-Host "3. Getting Bug by ID ($bugId)..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/bugs/$bugId" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing
        $bug = $response.Content | ConvertFrom-Json
        Write-Host "Success! Bug: $($bug.title)" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Get My Reports
Write-Host "4. Getting My Reported Bugs..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/bugs/my-reports" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    $myBugs = $response.Content | ConvertFrom-Json
    Write-Host "Success! Retrieved $($myBugs.Count) bugs" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get My Assigned Bugs
Write-Host "5. Getting My Assigned Bugs..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/bugs/my-assigned" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    $assigned = $response.Content | ConvertFrom-Json
    Write-Host "Success! Retrieved $($assigned.Count) bugs" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "API Testing Complete!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
