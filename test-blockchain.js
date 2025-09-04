const { ethers } = require("ethers");

async function testBlockchain() {
  try {
    console.log("🔗 Testing Ganache connection...");

    // Connect to Ganache
    const provider = new ethers.JsonRpcProvider("http://18.143.65.80:8545");

    // Test connection
    const network = await provider.getNetwork();
    console.log(
      `✅ Connected to network: ${network.name} (chainId: ${network.chainId})`
    );

    // Get block number
    const blockNumber = await provider.getBlockNumber();
    console.log(`📦 Current block number: ${blockNumber}`);

    // Test wallet
    const privateKey =
      "0x1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727";
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(`💰 Wallet address: ${wallet.address}`);

    // Get balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`💵 Wallet balance: ${ethers.formatEther(balance)} ETH`);

    // Test a simple transaction
    console.log("🚀 Sending test transaction...");
    const tx = await wallet.sendTransaction({
      to: "0x6Fac4D18c912343BF86fa7049364Dd4E424Ab9C0", // Second account
      value: ethers.parseEther("0.001"),
      gasLimit: 21000,
    });

    console.log(`📝 Transaction hash: ${tx.hash}`);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log(`⛽ Gas used: ${receipt.gasUsed}`);

    console.log("🎉 Blockchain connection test successful!");
  } catch (error) {
    console.error("❌ Blockchain test failed:", error.message);
  }
}

testBlockchain();
