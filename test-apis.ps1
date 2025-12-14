# PowerShell API Testing Script for CryptoMembership
# Make sure the Next.js server is running on http://localhost:3000

$BASE_URL = "http://localhost:3000"
Write-Host "Testing CryptoMembership API Endpoints..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Get all memberships
Write-Host "1. Testing GET /api/memberships" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/memberships" -Method GET -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 2: Get membership by ID
Write-Host "2. Testing GET /api/memberships/1?byId=true" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/memberships/1?byId=true" -Method GET -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 3: Create a test user
Write-Host "3. Testing POST /api/users" -ForegroundColor Yellow
try {
    $body = @{
        walletAddress = "0x1234567890123456789012345678901234567890"
        username = "testuser"
        bio = "Test bio"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/users" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 4: Get user
Write-Host "4. Testing GET /api/users?walletAddress=0x1234567890123456789012345678901234567890" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/users?walletAddress=0x1234567890123456789012345678901234567890" -Method GET -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 5: Get content
Write-Host "5. Testing GET /api/content" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/content" -Method GET -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 6: Get content by membership ID
Write-Host "6. Testing GET /api/content?membershipId=1" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/content?membershipId=1" -Method GET -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 7: Sync membership
Write-Host "7. Testing POST /api/memberships/sync" -ForegroundColor Yellow
try {
    $body = @{
        membershipId = 1
        creator = "0x1234567890123456789012345678901234567890"
        name = "Test Membership"
        description = "Test Description"
        price = 10.5
        isRecurring = $false
        category = "tech"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/memberships/sync" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 8: SideShift create order
Write-Host "8. Testing POST /api/sideshift/create" -ForegroundColor Yellow
try {
    $body = @{
        depositCoin = "ETH"
        settleCoin = "USDC"
        settleAddress = "0x0d42ddE442AbD206B24b57fd02F83a9693cF9D5E"
        settleAmount = "1000000"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/sideshift/create" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Status: $statusCode" -ForegroundColor Red
    try {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        $errorJson = $errorBody | ConvertFrom-Json
        Write-Host "Error: $($errorJson.error)" -ForegroundColor Red
        if ($errorJson.details) {
            Write-Host "Details: $($errorJson.details | ConvertTo-Json -Compress)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
    if ($statusCode -eq 500) {
        Write-Host "Note: This is likely due to missing SIDESHIFT_SECRET or SIDESHIFT_AFFILIATE_ID in .env.local" -ForegroundColor Yellow
    }
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 9: SideShift order status
Write-Host "9. Testing GET /api/sideshift/status?orderId=test123" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/sideshift/status?orderId=test123" -Method GET -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Status: $statusCode" -ForegroundColor Red
    try {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        $errorJson = $errorBody | ConvertFrom-Json
        Write-Host "Error: $($errorJson.error)" -ForegroundColor Red
        if ($errorJson.details) {
            Write-Host "Details: $($errorJson.details | ConvertTo-Json -Compress)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
    if ($statusCode -eq 500) {
        Write-Host "Note: This is likely due to missing SIDESHIFT_SECRET or SIDESHIFT_AFFILIATE_ID in .env.local" -ForegroundColor Yellow
    }
}
Write-Host ""
Write-Host "---"
Write-Host ""

Write-Host "API Testing Complete!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

