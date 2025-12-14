const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Read USDC address from deployment.json if it exists
  let usdcAddress = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582"; // Default mock USDC
  
  if (fs.existsSync("./deployment.json")) {
    const deploymentInfo = JSON.parse(fs.readFileSync("./deployment.json", "utf8"));
    if (deploymentInfo.usdcAddress) {
      usdcAddress = deploymentInfo.usdcAddress;
      console.log("Using USDC address from deployment.json:", usdcAddress);
    }
  }
  
  console.log("Deploying MembershipNFT contract with USDC:", usdcAddress);

  const MembershipNFT = await hre.ethers.getContractFactory("MembershipNFT");
  const membershipNFT = await MembershipNFT.deploy(usdcAddress);

  await membershipNFT.waitForDeployment();

  const address = await membershipNFT.getAddress();
  console.log("MembershipNFT deployed to:", address);
  console.log("Network:", hre.network.name);
  
  // Save deployment address
  let deploymentInfo = {};
  
  if (fs.existsSync("./deployment.json")) {
    deploymentInfo = JSON.parse(fs.readFileSync("./deployment.json", "utf8"));
  }
  
  deploymentInfo.membershipNFTAddress = address;
  deploymentInfo.network = hre.network.name;
  deploymentInfo.timestamp = new Date().toISOString();
  
  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

