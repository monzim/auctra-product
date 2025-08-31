const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const solc = require("solc");

async function main() {
  try {
    // 1. Setup - Paths and Provider
    const contractPath = path.resolve(
      __dirname,
      "../contracts",
      "CompanyRegistry.sol"
    );
    if (!fs.existsSync(contractPath)) {
      throw new Error(`Contract file not found at ${contractPath}`);
    }
    const source = fs.readFileSync(contractPath, "utf8");
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    // Check provider connection
    const network = await provider.getNetwork();
    console.log(
      `Connected to network: ${network.name} (chainId: ${network.chainId})`
    );

    // 2. Check wallet balance
    const wallet = new ethers.Wallet(
      "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
      provider
    );
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet address: ${wallet.address}`);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);

    if (balance === 0n) {
      throw new Error(
        "Wallet has no funds. Please fund the wallet or use a different account."
      );
    }

    // 3. Compile the contract
    const input = {
      language: "Solidity",
      sources: {
        "CompanyRegistry.sol": {
          content: source,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"],
          },
        },
      },
    };

    console.log("Compiling contract...");
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    console.log(
      "Compilation output:",
      JSON.stringify(output.contracts, null, 2)
    );

    if (
      output.errors &&
      output.errors.some((err) => err.severity === "error")
    ) {
      console.error("Compilation errors:");
      output.errors.forEach((err) => console.error(err.formattedMessage));
      throw new Error("Compilation failed.");
    }

    const contractOutput =
      output.contracts["CompanyRegistry.sol"]["CompanyRegistry"];
    if (!contractOutput) {
      throw new Error(
        "Contract 'CompanyRegistry' not found in compilation output."
      );
    }
    if (
      !contractOutput.evm ||
      !contractOutput.evm.bytecode ||
      !contractOutput.evm.bytecode.object
    ) {
      throw new Error("Bytecode not found in compilation output.");
    }
    if (!contractOutput.abi) {
      throw new Error("ABI not found in compilation output.");
    }

    console.log("Contract compiled successfully.");
    const bytecode = contractOutput.evm.bytecode.object;
    const abi = contractOutput.abi;

    // Debug: Log ABI and Bytecode
    console.log("Contract ABI:", JSON.stringify(abi, null, 2));
    console.log("Contract Bytecode:", bytecode);
    if (!bytecode || bytecode === "0x") {
      throw new Error("Invalid bytecode: Empty or undefined.");
    }
    if (!abi || !Array.isArray(abi)) {
      throw new Error("Invalid ABI: Empty or not an array.");
    }

    // 4. Deploy the contract
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    console.log("Estimating gas...");
    const deployTx = factory.getDeployTransaction();
    const gasEstimate = await provider.estimateGas({
      ...deployTx,
      from: wallet.address,
    });
    console.log(`Estimated gas: ${gasEstimate}`);

    console.log("Deploying contract...");
    const contract = await factory.deploy({
      gasLimit: gasEstimate,
      gasPrice: ethers.parseUnits("20", "gwei"),
    });
    const receipt = await contract.deploymentTransaction().wait();
    const contractAddress = await contract.getAddress();
    console.log(`Contract deployed to address: ${contractAddress}`);

    // 5. Save ABI and address for the frontend
    const frontendConfigDir = path.resolve(
      __dirname,
      "../../src/lib/blockchain"
    );
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
    console.log(
      "Saved contract config to src/lib/blockchain/contract-config.json"
    );
  } catch (error) {
    console.error("Error during deployment:", error.message);
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => console.log("Deployment script finished successfully."))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
