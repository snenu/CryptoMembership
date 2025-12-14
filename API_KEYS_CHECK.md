# API Keys Configuration Check

This document helps you verify that all required API keys are properly configured.

## Required Environment Variables

### 1. WalletConnect (Required for wallet connections)
- **Variable**: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` or `NEXT_PUBLIC_WC_PROJECT_ID`
- **How to get**: 
  1. Go to https://cloud.walletconnect.com/
  2. Create a new project
  3. Copy the Project ID
- **Status**: ⚠️ **REQUIRED** - Without this, wallet connections won't work

### 2. Polygon RPC (Required for blockchain interactions)
- **Variable**: `NEXT_PUBLIC_POLYGON_AMOY_RPC` or `POLYGON_AMOY_RPC`
- **Default**: Uses public RPC `https://rpc-amoy.polygon.technology` if not set
- **How to get**: 
  1. Sign up at https://www.alchemy.com/ or https://www.infura.io/
  2. Create a Polygon Amoy testnet endpoint
  3. Copy the RPC URL
- **Status**: ⚠️ **RECOMMENDED** - Public RPC may be rate-limited

### 3. Smart Contract Address (Required for membership functionality)
- **Variable**: `NEXT_PUBLIC_CONTRACT_ADDRESS`
- **How to get**: 
  1. Deploy the contract using `npm run deploy`
  2. Copy the address from `deployment.json`
- **Status**: ⚠️ **REQUIRED** - Without this, memberships won't work

### 4. MongoDB (Required for database)
- **Variable**: `MONGODB_URI`
- **How to get**: 
  1. Sign up at https://www.mongodb.com/cloud/atlas
  2. Create a cluster
  3. Get the connection string
- **Status**: ⚠️ **REQUIRED** - Without this, data won't persist

### 5. Pinata IPFS (Required for image uploads)
- **Variables**: 
  - `PINATA_API_KEY`
  - `PINATA_SECRET_KEY`
- **How to get**: 
  1. Sign up at https://www.pinata.cloud/
  2. Go to API Keys section
  3. Create a new API key
  4. Copy both the API Key and Secret Key
- **Status**: ⚠️ **REQUIRED** - Without this, image uploads won't work

### 6. SideShift (Required for multi-crypto payments)
- **Variables**: 
  - `SIDESHIFT_SECRET`
  - `SIDESHIFT_AFFILIATE_ID`
- **How to get**: 
  1. Sign up at https://sideshift.ai/
  2. Go to API section
  3. Generate API credentials
  4. Copy the Secret and Affiliate ID
- **Status**: ⚠️ **REQUIRED** - Without this, payment processing won't work

## Quick Check Script

You can use the utility function to check your configuration:

```typescript
import { checkApiKeys, getMissingKeys } from '@/utils/configCheck'

// Check all keys
const status = checkApiKeys()
console.log(status)

// Get only missing keys
const missing = getMissingKeys()
console.log('Missing keys:', missing)
```

## Environment File Setup

Create a `.env.local` file in the root directory with:

```env
# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Polygon
NEXT_PUBLIC_POLYGON_AMOY_RPC=your_rpc_url_here

# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here

# MongoDB
MONGODB_URI=your_mongodb_uri_here

# Pinata
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here

# SideShift
SIDESHIFT_SECRET=your_sideshift_secret_here
SIDESHIFT_AFFILIATE_ID=your_affiliate_id_here
```

## Testing Your Configuration

After setting up your environment variables:

1. Restart your development server: `npm run dev`
2. Check the browser console for any configuration errors
3. Try connecting a wallet - it should work if WalletConnect is configured
4. Try creating a membership - it should work if all keys are set

## Troubleshooting

### Wallet won't connect
- Check that `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Make sure you've restarted the dev server after adding the key
- Check browser console for errors

### Images won't upload
- Check that both `PINATA_API_KEY` and `PINATA_SECRET_KEY` are set
- Verify your Pinata account is active
- Check API route logs for specific errors

### Payments won't process
- Check that both `SIDESHIFT_SECRET` and `SIDESHIFT_AFFILIATE_ID` are set
- Verify your SideShift account has API access enabled
- Check the API route response for specific errors

### Database errors
- Check that `MONGODB_URI` is correct
- Verify your MongoDB cluster is running
- Check network connectivity to MongoDB
