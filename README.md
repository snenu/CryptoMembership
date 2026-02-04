# 🎫 CryptoMembership - Decentralized Membership Platform

A Web3 alternative to Patreon, Discord subscriptions, and paid communities. Built on Polygon with NFT-based access control and multi-crypto payments via SideShift.

## 🌟 What is CryptoMembership?

CryptoMembership is a decentralized membership platform that allows creators and communities to monetize their content through blockchain-based memberships. Unlike traditional platforms like Patreon or Discord, CryptoMembership:

- **Eliminates platform lock-in**: Your membership is an NFT you truly own
- **Accepts any cryptocurrency**: Pay with Bitcoin, Ethereum, Solana, or any crypto via SideShift
- **No central authority**: Built on Polygon blockchain for true decentralization
- **Censorship-resistant**: Your membership can't be revoked by a platform
- **Global access**: No geographic restrictions or payment method limitations

## 🎯 What Does It Do?

### For Creators:
- Create paid memberships with custom pricing
- Set one-time or recurring (monthly) memberships
- Upload exclusive content that's gated behind NFT ownership
- Track members and revenue through analytics dashboard
- Receive payments in USDC (stablecoin) regardless of what crypto users pay with

### For Members:
- Browse and discover memberships across various categories
- Pay with any cryptocurrency you own (SideShift handles conversion)
- Receive an NFT that proves your membership
- Access exclusive gated content
- Transfer or sell your membership NFT if desired
- Never lose access due to platform bans

## 🔄 How It Works

### 1. Membership Creation Flow
```
Creator connects wallet
    ↓
Fills out membership details (name, description, price, category)
    ↓
Uploads cover image to IPFS (Pinata)
    ↓
Creates membership on Polygon smart contract
    ↓
Membership NFT contract mints membership metadata
    ↓
Membership appears on platform
```

### 2. Membership Purchase Flow
```
User browses memberships
    ↓
Clicks "Join Membership"
    ↓
Selects payment cryptocurrency (ETH, BTC, SOL, etc.)
    ↓
SideShift creates conversion order
    ↓
User pays with selected crypto
    ↓
SideShift converts to USDC and sends to contract
    ↓
Smart contract mints Membership NFT to user
    ↓
User gains access to gated content
```

### 3. Access Control Flow
```
User tries to access gated content
    ↓
Website checks: Wallet connected?
    ↓
Website checks: User owns Membership NFT?
    ↓
Smart contract verifies NFT ownership on-chain
    ↓
If valid: Content unlocked
If invalid: Paywall shown
```

## 🔗 How We Use Polygon

Polygon is the **core blockchain layer** of CryptoMembership. Here's how it's integrated:

### 1. **Membership NFTs (ERC-721)**
- Each membership purchase mints a unique NFT on Polygon
- NFT metadata stored on IPFS (decentralized storage)
- NFT proves membership and grants access
- NFTs are transferable and tradeable

### 2. **USDC Payments**
- All membership prices are in USDC (USD Coin)
- USDC provides price stability for creators
- Payments processed on Polygon for low fees (~$0.01 per transaction)
- Smart contract handles payment distribution automatically

### 3. **Access Control**
- Smart contract verifies NFT ownership before granting access
- On-chain verification ensures security and transparency
- No centralized database can revoke access
- Access checks happen in real-time via blockchain queries

### 4. **Why Polygon?**
- **Low fees**: Transactions cost fractions of a cent
- **Fast**: 2-second block times
- **Ethereum-compatible**: Works with existing wallets and tools
- **Scalable**: Can handle thousands of transactions per second
- **Eco-friendly**: Proof-of-Stake consensus

- ### Contract Address
- **Polygon Amoy**: `0xA8006F58a9fe59e23a8768549ebfA89A9dE75908`


## 💳 How We Use SideShift

SideShift removes the friction of cryptocurrency payments. Here's how it works:

### The Problem Without SideShift:
- Users must own USDC on Polygon to join
- Users need to swap their crypto to USDC first
- Multiple transactions required
- High gas fees for swaps
- Complex user experience

### The Solution With SideShift:
1. **User selects any crypto** (Bitcoin, Ethereum, Solana, etc.)
2. **SideShift creates a conversion order** via API
3. **User sends their crypto** to SideShift's deposit address
4. **SideShift automatically converts** to USDC
5. **USDC sent directly** to our smart contract
6. **NFT minted** to user's wallet

### Benefits:
- ✅ Users pay with crypto they already own
- ✅ No need to swap tokens manually
- ✅ Single transaction for user
- ✅ Creator always receives USDC (stable income)
- ✅ Supports 100+ cryptocurrencies
- ✅ Non-custodial (SideShift doesn't hold funds)

### Technical Integration:
- SideShift API (`https://sideshift.ai/api/v2`) handles conversions
- Our backend creates orders via API
- Frontend polls for order completion
- Once confirmed, smart contract mints NFT

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │  ← Frontend (React, TypeScript, TailwindCSS)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────────┐
│ MongoDB│ │  Polygon  │  ← Data Storage
│        │ │ Blockchain│
└───┬───┘ └──┬────────┘
    │        │
    │    ┌───▼──────┐
    │    │ Smart    │  ← MembershipNFT Contract
    │    │ Contract │
    │    └──────────┘
    │
┌───▼────────┐  ┌──────▼──────┐
│   Pinata   │  │  SideShift   │  ← External Services
│   (IPFS)   │  │     API      │
└────────────┘  └──────────────┘
```

## 📋 Features

- 🪪 **NFT-Based Memberships**: Each membership is an NFT that proves access
- 💳 **Multi-Crypto Payments**: Pay with any cryptocurrency via SideShift
- 🌐 **Decentralized**: Built on Polygon blockchain
- 🔐 **Secure Access Control**: Smart contract-based permission system
- 📊 **Creator Analytics**: Track members and revenue
- 🎨 **Beautiful UI**: Light pink and white theme
- 👥 **Member Profiles**: See who's in each membership
- 📸 **Image Support**: Upload and display membership images
- 🔄 **Recurring Memberships**: Monthly subscription support
- 📱 **Mobile Responsive**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Blockchain**: Polygon Amoy Testnet, Solidity, Hardhat
- **Web3**: Wagmi, Viem, WalletConnect
- **Storage**: Pinata (IPFS) for decentralized content storage
- **Database**: MongoDB for off-chain data (user profiles, content metadata)
- **Payments**: SideShift API for multi-crypto payments

## 🚀 Setup

### Prerequisites

- Node.js 18+
- MongoDB account
- Pinata account (for IPFS storage)
- SideShift API credentials
- WalletConnect Project ID
- Polygon Amoy testnet MATIC (for gas fees)

### Installation

1. **Clone the repository:**
```bash
git clone <repo-url>
cd CryptoMembership
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file with:
```env
# Blockchain
PRIVATE_KEY=your_private_key
POLYGON_AMOY_RPC=your_polygon_amoy_rpc_url
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_USDC_ADDRESS=usdc_token_address
NEXT_PUBLIC_POLYGON_AMOY_RPC=your_polygon_amoy_rpc_url

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id

# Database
MONGODB_URI=your_mongodb_uri

# IPFS Storage
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Payments
SIDESHIFT_SECRET=your_sideshift_secret
SIDESHIFT_AFFILIATE_ID=your_sideshift_affiliate_id
SIDESHIFT_API=https://sideshift.ai/api/v2
```

4. **Deploy smart contracts:**
```bash
# Compile contracts
npm run compile

# Deploy MockUSDC first
npx hardhat run scripts/deploy-usdc.js --network polygonAmoy

# Deploy MembershipNFT
npx hardhat run scripts/deploy.js --network polygonAmoy
```

5. **Update `.env.local`** with deployed contract addresses from `deployment.json`

6. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
CryptoMembership/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── memberships/   # Membership endpoints
│   │   ├── users/         # User endpoints
│   │   ├── members/       # Member endpoints
│   │   ├── content/       # Content endpoints
│   │   ├── pinata/        # IPFS upload endpoints
│   │   └── sideshift/     # SideShift payment endpoints
│   ├── membership/        # Membership pages
│   ├── dashboard/         # User dashboard
│   ├── profile/           # User profile
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── Navbar.tsx         # Navigation bar
│   ├── MembershipCard.tsx # Membership card component
│   ├── MemberCard.tsx     # Member card component
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── Toast.tsx          # Notification component
├── contracts/             # Solidity smart contracts
│   ├── MembershipNFT.sol  # Main membership contract
│   └── MockUSDC.sol       # Mock USDC for testing
├── lib/                   # Utilities and configs
│   ├── web3config.ts      # Web3 configuration
│   ├── contract.ts        # Contract ABIs
│   └── mongodb.ts         # MongoDB connection
├── models/                # MongoDB models
│   ├── User.ts            # User model
│   ├── Membership.ts      # Membership model
│   ├── Member.ts          # Member model
│   └── Content.ts         # Content model
├── scripts/               # Deployment scripts
│   ├── deploy-usdc.js    # Deploy USDC contract
│   └── deploy.js          # Deploy membership contract
└── utils/                 # Helper functions
    ├── pinata.ts          # IPFS upload utilities
    ├── sideshift.ts       # SideShift API utilities
    └── contractEvents.ts  # Contract event parsing
```

## 🔌 API Routes

### Memberships
- `GET /api/memberships` - List all active memberships
- `GET /api/memberships/[id]` - Get membership details
- `POST /api/memberships` - Create membership (blockchain)
- `POST /api/memberships/sync` - Sync blockchain data to MongoDB

### Users
- `GET /api/users` - Get user by wallet address
- `POST /api/users` - Create or update user profile

### Members
- `GET /api/members/[membershipId]` - Get all members of a membership
- `POST /api/members` - Register a new member

### Content
- `GET /api/content` - Get gated content
- `POST /api/content` - Create gated content

### IPFS
- `POST /api/pinata/upload` - Upload file/image to IPFS

### Payments
- `POST /api/sideshift/create` - Create SideShift payment order
- `GET /api/sideshift/status?orderId=xxx` - Check order status

## 📄 Pages

- `/` - Landing page with features and how it works
- `/explore` - Browse all memberships with search and filters
- `/dashboard` - User dashboard (memberships, created memberships)
- `/create-membership` - Create new membership
- `/membership/[id]` - Membership details and join page
- `/membership/[id]/content` - Gated content (requires NFT)
- `/analytics` - Creator analytics dashboard
- `/profile` - User profile management
- `/settings` - Account settings
- `/help` - FAQ and support

## 🔒 Security

- **On-chain access control**: All permissions verified on blockchain
- **NFT ownership verification**: Smart contract checks before granting access
- **OpenZeppelin libraries**: Industry-standard security practices
- **Reentrancy guards**: Protection against reentrancy attacks
- **Input validation**: All user inputs validated
- **Error handling**: Comprehensive error handling throughout

## 🚢 Deployment

### Smart Contract Deployment

1. Ensure you have testnet MATIC in your wallet
2. Run deployment scripts:
```bash
npm run deploy-usdc
npm run deploy
```

3. Copy contract addresses from `deployment.json` to `.env.local`

### Frontend Deployment

Deploy to Vercel, Netlify, or any Next.js-compatible platform:

```bash
npm run build
npm start
```




## 🧪 Testing

Test all API endpoints using the PowerShell script:

```powershell
.\test-apis.ps1
```
 

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ on Polygon using SideShift for payments**
