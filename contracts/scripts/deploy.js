const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const solc = require('solc');

async function main() {
    // 1. Setup - Paths and Provider
    const contractPath = path.resolve(__dirname, '../contracts', 'CompanyRegistry.sol');
    const source = fs.readFileSync(contractPath, 'utf8');
    // NOTE: This URL points to the Docker service name. When running this script locally (not in Docker),
    // you might need to change it to "http://127.0.0.1:8545".
    const provider = new ethers.JsonRpcProvider("http://ganache:8545");

    // 2. Compile the contract
    const input = {
        language: 'Solidity',
        sources: {
            'CompanyRegistry.sol': {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    console.log("Compiling contract...");
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
        console.error("Compilation errors: ");
        output.errors.forEach(err => {
            console.error(err.formattedMessage);
        });
        throw new Error("Compilation failed.");
    }
    console.log("Contract compiled successfully.");

    const contract = output.contracts['CompanyRegistry.sol']['CompanyRegistry'];
    const bytecode = contract.evm.bytecode.object;
    const abi = contract.abi;

    // 3. Deploy the contract
    // This is the default private key from Ganache, don't use this in production.
    const wallet = new ethers.Wallet("0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d", provider);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    console.log("Deploying contract...");
    const deployedContract = await factory.deploy();
    await deployedContract.waitForDeployment();

    const contractAddress = await deployedContract.getAddress();
    console.log(`Contract deployed to address: ${contractAddress}`);

    // 4. Save ABI and address for the frontend
    const frontendConfigDir = path.resolve(__dirname, '../../src/lib/blockchain');
    if (!fs.existsSync(frontendConfigDir)) {
        fs.mkdirSync(frontendConfigDir, { recursive: true });
    }

    const config = {
        address: contractAddress,
        abi: abi,
    };

    fs.writeFileSync(
        path.join(frontendConfigDir, "contract-config.json"),
        JSON.stringify(config, null, 2)
    );

    console.log("Saved contract config to src/lib/blockchain/contract-config.json");
}

main()
    .then(() => console.log("Deployment script finished successfully."))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
