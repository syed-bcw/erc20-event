# ERC20 Event Log

A Node.js script to deploy an ERC20 token contract and log transfer events.

## How to use

1. Install [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).
2. Install npm dependencies by running the following command in the project directory:
```
npm install
```
3. Copy the `.env.example` file to `.env` and fill in the values for your Ethereum node provider URL and private key:
```bash
cp .env.example .env
```
4. Edit the `.env` file:
```properties
PROVIDER_URL=https://your.ethereum.node.provider.url
PRIVATE_KEY=yourPrivateKey
```
5. Run the script by running the following command in the project directory:
```bash
node index.js
```
The script will:

- Retrieve your account's public address using your private key.
- Check your account's balance and log it to the console.
- Deploy an ERC20 token contract.
- Listen for transfer events emitted by the contract and log them to the console.
- Transfer 0 tokens to your account and log the transaction hash.
