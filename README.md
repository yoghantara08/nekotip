# `NekoTip`

**NekoTip** is a decentralized platform built on the **Internet Computer Protocol (ICP)**. It empowers fans to support their favorite creators securely through donations and unlock exclusive content. With a built-in referral program, NekoTip creates a rewarding ecosystem for both fans and creators.

<p align="center">
  <img src="https://amethyst-wrong-bobolink-547.mypinata.cloud/ipfs/QmeNwVtZTFs3aVsoqBkwrRMaQR3iBsgTE4CuRvV2rsPwVf" width="100%">
</p>

**Video Demonstration**: [https://youtu.be/V3OTgcy7Gc4](https://youtu.be/V3OTgcy7Gc4)

**Mainnet Deployment**: [https://4eamd-wiaaa-aaaal-artgq-cai.icp0.io/](https://4eamd-wiaaa-aaaal-artgq-cai.icp0.io/)

---

## 🚀 Features  

### 🌟 For Fans  
- **Explore Creators**: Discover and follow your favorite creators.  
- **Donate to Creators**: Send ICP tokens directly to creators and show your support.  
- **Unlock Exclusive Content**: Access premium posts by creators for a set fee.  
- **Referral Program**: Earn incentives by referring others to the platform.  

### 🎨 For Creators  
- **Monetize Content**: Post exclusive content and set prices for unlocking.  
- **Receive Donations**: Accept ICP tokens directly from your supporters.  
- **Manage Followers**: Track your fans and build your community.  
- **Dashboard Insights**: View donations, referral earnings, and other metrics.  
- **Secure Withdrawals**: Transfer earnings to your personal wallet.  

---

## 💻 Technology Stack  

### Core ICP Technologies  
- **Internet Computer Protocol (ICP)** 
- **Motoko**
- **ICP Ledger**
- **Internet Identity**

### Frontend Technologies 
- **React.js**
- **Vite** 
- **Typescript**
- **Redux**
- **Tailwind**
- **Lucide Dev**

### IPFS Provider
- **Pinata Web3**

---

## 🛠️ Prerequisites

Ensure you have the following installed:

- **DFX (Dfinity SDK)** - [Installation Guide](https://internetcomputer.org/docs/current/developer-docs/getting-started/install)
- **Node.js** (Latest LTS version) - [Download](https://nodejs.org/)
- **Pinata Account** - [Sign Up](https://pinata.cloud/)

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yoghantara08/nekotip.git
   cd nekotip
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

## 🔐 Environment Setup

### Pinata Configuration

1. Log in to [Pinata](https://pinata.cloud/)
2. Navigate to **API Keys**
3. Create a new API key:
   - Provide a descriptive name
   - Set appropriate permissions
4. Copy the generated **JWT Token**
5. Go to **Gateways** and note your domain

### Environment Variables

Create a `.env` file in the `nekotip_frontend` directory:

```bash
VITE_PINATA_JWT=<your-pinata-jwt>
VITE_GATEWAY_URL=<your-pinata-domain>
```

## 💻 Local Development

1. Start the Internet Computer Local Network:
   ```bash
   dfx start --clean --background
   ```

2. Deploy the ICP Ledger:
   ```bash
   npm run deploy-ledger
   # Alternative: Follow instructions in deploy_icp_ledger.sh
   ```

3. Deploy project canisters:
   ```bash
   dfx deploy
   ```

4. Launch development server:
   ```bash
   npm start
   ```
---

## 📅 Future Plans  

We’re excited to keep improving NekoTip! Here’s what’s in store for future updates:  

1. **Enhanced User Experience and Design**  
   - Continuously improving the design and interface for a more seamless and engaging user experience.  

2. **Wallet and Withdrawal Features**  
   - Secure wallet integration and withdrawal functionality for creators to manage their funds effortlessly.  

3. **Leaderboard with NFT Badges**  
   - Introducing a leaderboard to celebrate top contributors with exclusive NFT badges as rewards.  

4. **Community Interaction Features**  
   - Adding tools for fans to engage directly with creators, fostering stronger connections.  
