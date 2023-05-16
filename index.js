const dotenv = require('dotenv');
const { ethers } = require("ethers");
const ERC20 = require('./erc20abi.json');

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const providerUrl = process.env.PROVIDER_URL;

const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const signer = new ethers.Wallet(privateKey, provider);

const publicAddress = signer.address;
console.log("Public Address: ", publicAddress);

const main = async () => {
    const balance = await provider.getBalance(publicAddress);
    console.log("Balance: ", ethers.utils.formatEther(balance));

    if (balance < 0.1) {
        console.log("Insufficient balance to continue");
        return;
    }

    // deploy contract
    const factory = new ethers.ContractFactory(ERC20.abi, ERC20.bytecode, signer);

    const contract = await factory.deploy();
    const contractAddress = contract.address;
    console.log("Contract Address: ", contractAddress);
    await contract.deployed();
    console.log("Contract Deployed");

    // Listen to transfer event
    contract.on("Transfer", (from, to, value, event) => {
        console.log("Event: ", event);
        console.log("Transfer Event: ", from, to, value.toString());
    });

    // Perform transfer
    const receipt = await contract.transfer(publicAddress, 0);
    console.log("Transaction Hash: ", receipt.hash);
    await receipt.wait()
    console.log("Transaction Mined");
}
main();
