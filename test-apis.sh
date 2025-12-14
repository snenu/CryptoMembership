#!/bin/bash

# API Testing Script for CryptoMembership
# Make sure the Next.js server is running on http://localhost:3000

BASE_URL="http://localhost:3000"
echo "Testing CryptoMembership API Endpoints..."
echo "=========================================="
echo ""

# Test 1: Get all memberships
echo "1. Testing GET /api/memberships"
curl -X GET "$BASE_URL/api/memberships" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s | head -20
echo ""
echo "---"
echo ""

# Test 2: Get membership by ID
echo "2. Testing GET /api/memberships/1?byId=true"
curl -X GET "$BASE_URL/api/memberships/1?byId=true" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "---"
echo ""

# Test 3: Create a test user
echo "3. Testing POST /api/users"
curl -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "username": "testuser",
    "bio": "Test bio"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "---"
echo ""

# Test 4: Get user
echo "4. Testing GET /api/users?walletAddress=0x1234567890123456789012345678901234567890"
curl -X GET "$BASE_URL/api/users?walletAddress=0x1234567890123456789012345678901234567890" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "---"
echo ""

# Test 5: Get content
echo "5. Testing GET /api/content"
curl -X GET "$BASE_URL/api/content" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "---"
echo ""

# Test 6: Get content by membership ID
echo "6. Testing GET /api/content?membershipId=1"
curl -X GET "$BASE_URL/api/content?membershipId=1" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "---"
echo ""

# Test 7: Sync membership (requires valid data)
echo "7. Testing POST /api/memberships/sync"
curl -X POST "$BASE_URL/api/memberships/sync" \
  -H "Content-Type: application/json" \
  -d '{
    "membershipId": 1,
    "creator": "0x1234567890123456789012345678901234567890",
    "name": "Test Membership",
    "description": "Test Description",
    "price": 10.5,
    "isRecurring": false,
    "category": "tech"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "---"
echo ""

# Test 8: SideShift create order (will fail without proper credentials, but tests endpoint)
echo "8. Testing POST /api/sideshift/create"
curl -X POST "$BASE_URL/api/sideshift/create" \
  -H "Content-Type: application/json" \
  -d '{
    "depositCoin": "ETH",
    "settleCoin": "USDC",
    "settleAddress": "0x0d42ddE442AbD206B24b57fd02F83a9693cF9D5E",
    "settleAmount": "1000000"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "---"
echo ""

# Test 9: SideShift order status
echo "9. Testing GET /api/sideshift/status?orderId=test123"
curl -X GET "$BASE_URL/api/sideshift/status?orderId=test123" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "---"
echo ""

echo "API Testing Complete!"
echo "=========================================="


