const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const solc = require("solc");

// Custom JSON.stringify replacer to handle BigInt
function stringifyWithBigInt(obj, space) {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === "bigint" ? value.toString() : value),
    space
  );
}

async function main() {
  try {
    // 1. Setup - Paths and Provider
    const contractPath = path.resolve(
      __dirname,
      "../contracts",
      "SimpleStorage.sol"
    );
    if (!fs.existsSync(contractPath)) {
      throw new Error(`Contract file not found at ${contractPath}`);
    }
    const source = fs.readFileSync(contractPath, "utf8");
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    // Check provider connection
    try {
      const network = await provider.getNetwork();
      console.log(
        `Connected to network: ${
          network.name
        } (chainId: ${network.chainId.toString()})`
      );
      const blockNumber = await provider.getBlockNumber();
      console.log(`Current block number: ${blockNumber}`);
    } catch (error) {
      throw new Error(`Failed to connect to provider: ${error.message}`);
    }

    // 2. Check wallet balance and nonce
    const wallet = new ethers.Wallet(
      "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
      provider
    );
    const balance = await provider.getBalance(wallet.address);
    const nonce = await provider.getTransactionCount(wallet.address, "pending");
    console.log(`Wallet address: ${wallet.address}`);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
    console.log(`Wallet nonce (pending): ${nonce}`);

    if (balance === 0n) {
      throw new Error(
        "Wallet has no funds. Please fund the wallet or use a different account."
      );
    }

    // 3. Compile the contract
    const input = {
      language: "Solidity",
      sources: {
        "SimpleStorage.sol": {
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

    if (
      output.errors &&
      output.errors.some((err) => err.severity === "error")
    ) {
      console.error("Compilation errors:");
      output.errors.forEach((err) => console.error(err.formattedMessage));
      throw new Error("Compilation failed.");
    }

    const contractOutput =
      output.contracts["SimpleStorage.sol"]["SimpleStorage"];
    if (!contractOutput) {
      throw new Error(
        "Contract 'SimpleStorage' not found in compilation output."
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
    console.log("Contract ABI:", stringifyWithBigInt(abi, 2));
    console.log(
      "Contract Bytecode (first 100 chars):",
      bytecode.substring(0, 100) + "..."
    );

    // 4. Deploy the contract
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    console.log("Preparing deployment transaction...");
    const deployTx = factory.getDeployTransaction();
    console.log("Deployment transaction data:", deployTx.data);

    // Attempt gas estimation
    let gasEstimate;
    try {
      console.log("Estimating gas...");
      gasEstimate = await provider.estimateGas({
        ...deployTx,
        from: wallet.address,
      });
      console.log(`Estimated gas: ${gasEstimate.toString()}`);
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError.message);
      console.error(
        "Full gas estimation error:",
        stringifyWithBigInt(gasError, 2)
      );
      console.warn("Using fallback gas limit of 3,000,000...");
      gasEstimate = 3000000;
    }

    // Use simple gas settings to avoid EIP-1559 issues
    const gasSettings = {
      gasLimit: gasEstimate,
      gasPrice: ethers.parseUnits("20", "gwei"),
      nonce: nonce,
    };
    console.log(
      "Deploying contract with settings:",
      stringifyWithBigInt(gasSettings, 2)
    );

    // Deploy the contract
    let contract;
    try {
      console.log("Sending deployment transaction...");
      contract = await factory.deploy(gasSettings);
      console.log(
        "Deployment transaction sent, hash:",
        contract.deploymentTransaction().hash
      );
    } catch (deployError) {
      console.error("Deployment failed:", deployError.message);
      console.error(
        "Full deployment error:",
        stringifyWithBigInt(deployError, 2)
      );
      throw deployError;
    }

    // Wait for transaction confirmation
    console.log("Waiting for deployment confirmation...");
    let receipt;
    try {
      receipt = await contract.deploymentTransaction().wait();
      console.log("Deployment receipt:", stringifyWithBigInt(receipt, 2));
    } catch (waitError) {
      console.error("Failed to wait for deployment:", waitError.message);
      console.error("Full wait error:", stringifyWithBigInt(waitError, 2));
      throw waitError;
    }

    if (!receipt || !receipt.contractAddress) {
      throw new Error("Deployment failed: No contract address in receipt.");
    }
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
      stringifyWithBigInt(config, 2)
    );
    console.log(
      "Saved contract config to src/lib/blockchain/contract-config.json"
    );
  } catch (error) {
    console.error("Error during deployment:", error.message);
    console.error("Full error details:", stringifyWithBigInt(error, 2));
    process.exit(1);
  }
}

main()
  .then(() => console.log("Deployment script finished successfully."))
  .catch((error) => {
    console.error("Unexpected error:", error.message);
    console.error("Full error details:", stringifyWithBigInt(error, 2));
    process.exit(1);
  });
