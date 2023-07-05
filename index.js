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
    const contractAddress = "0xCfbaDf1b38F76a46d27b93B5B957c1Ae33Ff2F5A";
    // Get the balance of the public address and log it
    const balance = await provider.getBalance(publicAddress);
    console.log("Balance: ", ethers.utils.formatEther(balance));

    // If balance is less than 0.1, log message and return
    if (balance < 0.1) {
        console.log("Insufficient balance to continue");
        return;
    }

    const filter = {
        address: contractAddress,
        topics: [
            ethers.utils.id("Transfer(address,address,uint256)")
        ]
    }

    const factory = new ethers.ContractFactory(ERC20.abi, ERC20.bytecode, signer);
    const _contract = factory.attach(contractAddress);
    console.log("Contract Address: ", _contract.address);

    provider.on(filter, (data) => {
        console.log("Event: ", data);
    });

    const mintreceipt = await _contract.mint('50000000');
    console.log("Transaction Hash: ", mintreceipt.hash);
    await mintreceipt.wait()
    console.log("Transaction Mined");
}

// Call the main function
main();
