const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying MultiChainWallet to", network.name);

  // Get the contract factory
  const MultiChainWallet = await ethers.getContractFactory("MultiChainWallet");

  // Deploy the contract
  const multiChainWallet = await MultiChainWallet.deploy();

  // Wait for the contract to be deployed
  await multiChainWallet.deployed();

  console.log("MultiChainWallet deployed to:", multiChainWallet.address);

  // Store the contract addresses
  const deployments = {
    [network.name]: {
      address: multiChainWallet.address,
    },
  };

  // Save the deployment information
  saveDeployments(deployments);

  // Verify the contract on Etherscan (if not on a local network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Verifying contract on Etherscan...");
    await verifyContract(multiChainWallet.address);
  }
}

function saveDeployments(deployments) {
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filePath = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(deployments, null, 2));
  console.log(`Deployment information saved to ${filePath}`);
}

async function verifyContract(contractAddress) {
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });