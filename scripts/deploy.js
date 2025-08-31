import pkg from "hardhat";
import fs from 'fs';
const { ethers } = pkg;

async function main() {
  console.log("Deploying AuctraTender contract...");

  const AuctraTender = await ethers.getContractFactory("AuctraTender");
  const auctraTender = await AuctraTender.deploy();

  await auctraTender.waitForDeployment();
  const contractAddress = await auctraTender.getAddress();

  console.log("AuctraTender deployed to:", contractAddress);

  // Save the contract address and ABI to a file for the frontend
  const contractData = {
    address: contractAddress,
    abi: AuctraTender.interface.format('json')
  };

  if (!fs.existsSync('./src/contracts')) {
    fs.mkdirSync('./src/contracts', { recursive: true });
  }

  fs.writeFileSync(
    './src/contracts/AuctraTender.json',
    JSON.stringify(contractData, null, 2)
  );

  console.log("Contract address and ABI saved to ./src/contracts/AuctraTender.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});