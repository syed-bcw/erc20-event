// Import necessary modules and files
const dotenv = require('dotenv');
const { ethers } = require("ethers");
const ERC20 = require('./erc20abi.json');

// Load environment variables
dotenv.config();

// Retrieve private key and provider URL from environment variables
const privateKey = process.env.PRIVATE_KEY;
const providerUrl = process.env.PROVIDER_URL;

// Create a provider and signer using the private key and provider URL
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const signer = new ethers.Wallet(privateKey, provider);

// Get public address from signer and log it
const publicAddress = signer.address;
console.log("Public Address: ", publicAddress);

// Define the main function
const main = async () => {
    // Get the balance of the public address and log it
    const balance = await provider.getBalance(publicAddress);
    console.log("Balance: ", ethers.utils.formatEther(balance));

    // If balance is less than 0.1, log message and return
    if (balance < 0.1) {
        console.log("Insufficient balance to continue");
        return;
    }

    // Deploy the ERC20 contract using the signer
    const factory = new ethers.ContractFactory(ERC20.abi, ERC20.bytecode, signer);
    const contract = await factory.deploy();
    const contractAddress = contract.address;
    console.log("Contract Address: ", contractAddress);
    await contract.deployed();
    console.log("Contract Deployed");

    // Listen for Transfer events emitted by the contract
    contract.on("Transfer", (from, to, value, event) => {
        console.log("Event: ", event);
        console.log("Transfer Event: ", from, to, value.toString());
    });

    // Perform a transfer of 0 tokens to the public address
    const receipt = await contract.transfer(publicAddress, 0);
    console.log("Transaction Hash: ", receipt.hash);
    await receipt.wait()
    console.log("Transaction Mined");
}

// Call the main function
main();
