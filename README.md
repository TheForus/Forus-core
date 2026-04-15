# Forus 

**Private, Secure, and Seamless Transactions on Ethereum & L2s.**

Forus enables users to receive assets through a shielded path, ensuring that their primary vault balances and transaction histories remain invisible to public indexing.

---

### ✨ Key Features

* **Reusable Links:** Share one link to receive payments multiple times—every payment goes to a unique, new address.
* **L2 Powered:** Fully optimized for **Arbitrum** for near-zero fees.
* **Total Privacy:** Obfuscates your transaction history and balance from public scanners like Etherscan.
* **Self-Custodial:** You own your keys. Your privacy is managed entirely on your device.

### 🛠️ How it Works

1.  **Create your Meta-Address:** Generate a secure, reusable link in the app.
2.  **Share & Receive:** Send your link to anyone. They send funds to a unique "stealth" address created just for that transaction.
3.  **Sync & Claim:** Use the Forus dashboard to scan the network and withdraw your funds to any wallet you choose.

### 💻 Technical Stack

* **Cryptography:** Elliptic Curve Diffie-Hellman (ECDH) for address derivation.
* **Smart Contracts:** `Logs.sol` (Solidity) for efficient metadata indexing.
* **Frontend:** React, Wagmi, and Ethers.js.
* **Performance:** 1-byte View Tags for lightning-fast transaction scanning.

### 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.
