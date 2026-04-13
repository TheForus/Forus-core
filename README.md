# Forus

Forus is a privacy-focused transfer application for shielded on-chain payments using stealth addresses. It lets a sender transfer funds to a receiver without exposing the receiver's primary wallet address in the public transaction flow.

The app generates a shareable Forus key, derives one-time stealth addresses for incoming payments, publishes the required ephemeral metadata on-chain, and lets the receiver later discover and withdraw funds using their secret file.

## Core Features

- Generate a public Forus key and matching secret key material
- Share a receiver-friendly payment link instead of a wallet address
- Send native ETH and supported ERC-20 assets privately through stealth address derivation
- Scan recent published stealth payloads using the uploaded secret file
- Detect matching stealth addresses and show current balances
- Withdraw funds directly from a matched stealth wallet

## How It Works

### 1. Key Generation

The receiver generates a Forus key pair inside the app:

- `Forus key`: safe to share
- `secret key`: must be stored securely and never shared

The secret key is used later to scan for matching stealth payments and unlock the corresponding withdrawal wallet.

### 2. Private Transfer

When a sender enters a receiver's Forus key:

- the app derives a one-time stealth address
- generates an ephemeral public key pair
- computes a shared secret prefix
- submits the payload to the on-chain `Logs` contract
- transfers ETH or supported ERC-20 tokens to the stealth address

This keeps the receiver's main wallet out of the visible transfer path.

### 3. Receive Flow

The receiver uploads the downloaded secret file in the `Receive` tab:

- the app scans recent published public key logs from the contract
- derives candidate stealth wallets from the uploaded secret
- checks balances for matching stealth addresses
- displays funded and matched addresses in the UI

### 4. Withdraw Flow

After a match is found:

- the user opens withdrawal from the matched stealth address
- enters a recipient wallet
- the app sends the withdrawable balance, minus required gas

## Supported Networks

The project currently includes support for:

- Arbitrum One
- Arbitrum Sepolia

Configured contract and chain metadata are stored in [src/helpers/ChainOptions.tsx](./src/helpers/ChainOptions.tsx).

## Tech Stack

- React
- TypeScript
- Ethers.js v5
- Wagmi
- ConnectKit
- Elliptic
- Notyf

## Project Structure

```text
src/
|- ui-components/
|  |- Container.tsx
|  |- NavHeader.tsx
|  |- Tx-wrapper.tsx
|  |- keys.tsx
|  |- TransferPanel.tsx
|  |- Receive.tsx
|  |- Withdraw.tsx
|  `- CopyRight.tsx
|- helpers/
|  |- ChainOptions.tsx
|  |- ERC20ABI.tsx
|  |- Crc.tsx
|  `- downloadTxt.tsx
|- checkers/
|  |- isDetected.tsx
|  `- ValidateChainData.tsx
|- artifacts/
|  `- contracts/Logs.sol/Logs.json
`- front-page/
```

## Local Development

### Prerequisites

- Node.js 18+
- npm
- MetaMask or a compatible injected wallet

### Install

```bash
npm install
```

### Start the app

```bash
npm start
```

The development server runs at:

```text
https://theforus.xyz
```

### Production build

```bash
npm run build
```

## User Flow

### Generate keys

1. Open the `Key Generation` tab
2. Click `Generate`
3. Copy the shareable Forus link
4. Download and store the secret key file securely

### Send funds

1. Open the app with a connected wallet
2. Paste the receiver's Forus key
3. Enter the amount
4. Confirm the transfer transaction

### Receive funds

1. Open the `Receive` tab
2. Upload the secret file
3. Review matched stealth addresses and balances
4. Select a funded address for withdrawal

### Withdraw funds

1. Open the `Withdraw` tab from a matched receive result
2. Enter the destination wallet address
3. Confirm the withdrawal transaction
4. Open the block explorer link after success

## Important Security Notes

- Never share the secret key file
- The secret key controls discovery and withdrawal from stealth wallets
- Always verify the connected chain before sending or withdrawing
- Keep backups of secret keys in a secure location

## Recent Improvements

- Stable key generation across in-app navigation
- More reliable receive scanning for recent stealth transactions
- Improved withdrawal gas handling and clearer error messages
- Fixed odd-length stealth payload encoding in transfer flow
- Cleaner notification styling through proper Notyf CSS loading

## Scripts

- `npm start`: run development server
- `npm test`: run tests
- `npm run build`: build production bundle

## License

This project is provided as-is for development and demonstration purposes.
