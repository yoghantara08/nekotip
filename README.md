# 🐾 NekoTip - Blockchain-Based Fan-to-Creator Donation Platform  

**NekoTip** is a decentralized platform built on the **Internet Computer Protocol (ICP)**. It empowers fans to support their favorite creators securely through donations and unlock exclusive content. With a built-in referral program, NekoTip creates a rewarding ecosystem for both fans and creators.

<p align="center">
  <img src="https://amethyst-wrong-bobolink-547.mypinata.cloud/ipfs/QmeNwVtZTFs3aVsoqBkwrRMaQR3iBsgTE4CuRvV2rsPwVf" width="100%">
</p>

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
- **Http Outcalls**

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

## 🛠️ Installation  

### Prerequisites  
- DFX (Dfinity SDK): Install via [Dfinity Documentation](https://smartcontracts.org/docs/quickstart/quickstart.html).  
- Node.js (18+ recommended)(https://nodejs.org/).  

### Steps  
1. **Clone the repository**:  
   ```bash
   git clone https://github.com/yourusername/nekotip.git
   cd nekotip
2. Install dependencies:
   ```
   npm install
3. Start the Internet Computer Local Network
   ```
   dfx start --clean --background
4. Deploy ICP Ledger Locally
   ```
   npm run deploy-ledger
   or
   Manually follow the instructions in deploy_icp_ledger.sh
