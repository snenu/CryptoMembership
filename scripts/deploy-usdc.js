const hre = require("hardhat");

async function main() {
  console.log("Deploying MockUSDC contract...");

  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();

  await mockUSDC.waitForDeployment();

  const address = await mockUSDC.getAddress();
  console.log("MockUSDC deployed to:", address);
  console.log("Network:", hre.network.name);
  
  // Save deployment address
  const fs = require("fs");
  let deploymentInfo = {};
  
  if (fs.existsSync("./deployment.json")) {
    deploymentInfo = JSON.parse(fs.readFileSync("./deployment.json", "utf8"));
  }
  
  deploymentInfo.usdcAddress = address;
  deploymentInfo.usdcNetwork = hre.network.name;
  deploymentInfo.usdcTimestamp = new Date().toISOString();
  
  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment.json");
  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


