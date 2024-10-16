async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());


    const initialFeedbackLimit = 5;
    const initialRatingThreshold = 7;
    const Feedback_token = await ethers.getContractFactory("FeedbackNFT");
    const contract = await Feedback_token.deploy(initialFeedbackLimit,initialRatingThreshold); // In order Feedback limit = 5, RatingThreshold = 8
  
  console.log("Feedback contract/token deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
