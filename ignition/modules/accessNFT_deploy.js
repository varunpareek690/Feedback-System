async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const access_token = await ethers.getContractFactory("AccessNFT");
    const accessNFT = await access_token.deploy();
  
  console.log("Access NFT deployed to:", await accessNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
