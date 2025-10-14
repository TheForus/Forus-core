Forus lets you receive ETH and ERC20 tokens privately without exposing your wallet address.
Built on Arbitrum, Forus combines stealth address technology with TEE-based key protection — giving users true end-to-end privacy and enterprise-grade security.

🔗 Live App: https://theforus.netlify.app/forus

💬 Twitter: @the_forus

🌐 Vision

Blockchain transparency exposes user identities and financial activity.
Forus solves this by enabling untraceable, one-time stealth addresses, powered by TEE-secured key management.
Your keys stays isolated within hardware-protected enclaves — never leaving the secure boundary.

Privacy shouldn’t be complicated — and with Forus, it isn’t.

⚙️ How It Works

🔑 Receiver Setup

Generate your Forus key pair (public & private).

The secret key is sent to and stored inside a TEE enclave, ensuring it never leaves secure hardware.

Share only your public link (meta-address) — no blockchain data is exposed.

📤 Sender Creates Stealth Address

The sender uses your public link to generate a unique one-time stealth address.

Funds are sent to this untraceable address.

Each transaction is fresh and unlinkable on-chain.

🧠 TEE Detection & Notification

The TEE runs 24/7, scanning the blockchain for transactions linked to your public key.

When it detects a payment, it notifies you instantly, without exposing your private key.

🏦 Secure Withdrawal

When you withdraw, the TEE enclave signs the transaction internally using your stored key.

The signed transaction is broadcast to the blockchain — your key never leaves the enclave.

🔒 Key Features
Feature	Description
🕵️ True Privacy	Stealth addresses unlink sender and receiver
🧠 TEE Protection	Private keys secured in hardware-enforced enclaves
⚡ Fast & Low Cost	Built on Arbitrum’s high-speed L2
🔑 Full Control	User-owned keys, verifiable enclave signing
🧰 Developer Ready	Open API for integrating private payments
🔔 Auto Detection	TEE continuously scans and detects private payments
🧩 Tech Stack

Frontend: React.js, TailwindCSS

Smart Contracts: Solidity, OpenZeppelin

Network: Arbitrum , horizen , metis

Wallet Integration: MetaMask / WalletConnect

Security Layer: Intel SGX / TEE (Trusted Execution Environment)

🧱 Why It Matters

Ethereum’s transparency is powerful — but privacy is essential.
Forus introduces TEE-powered stealth transactions, protecting users and developers from unwanted visibility while maintaining decentralization and compliance.
It bridges the gap between confidential finance and user-friendly Web3.

💬 Get Involved

Forus is an open public good — contributions and community feedback are welcome!

🐛 Report bugs or suggest features via GitHub Issues

🤝 Contribute improvements with Pull Requests

🪙 License

MIT License — free to use, modify, and build upon.
