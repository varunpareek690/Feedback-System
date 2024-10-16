const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("FeedbackNFT", function () {
  let FeedbackNFT;
  let feedbackNFT;
  let owner;
  let entity1;
  let entity2;
  let user1;
  let user2;
  let user3;
  
  const INITIAL_FEEDBACK_LIMIT = 5;
  const INITIAL_RATING_THRESHOLD = 8;

  beforeEach(async function () {
    // Get signers
    [owner, entity1, entity2, user1, user2, user3] = await ethers.getSigners();

    // Deploy contract
    FeedbackNFT = await ethers.getContractFactory("FeedbackNFT");
    feedbackNFT = await FeedbackNFT.deploy(INITIAL_FEEDBACK_LIMIT, INITIAL_RATING_THRESHOLD);

    // List entity1 for testing
    await feedbackNFT.connect(owner).listEntity(entity1.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await feedbackNFT.owner()).to.equal(owner.address);
    });

    it("Should set initial feedback limit correctly", async function () {
      expect(await feedbackNFT.feedbackLimit()).to.equal(INITIAL_FEEDBACK_LIMIT);
    });

    it("Should set initial rating threshold correctly", async function () {
      expect(await feedbackNFT.ratingThreshold()).to.equal(INITIAL_RATING_THRESHOLD);
    });
  });

  describe("Entity Management", function () {
    it("Should allow owner to list an entity", async function () {
      await expect(feedbackNFT.connect(owner).listEntity(entity2.address))
        .to.emit(feedbackNFT, "EntityListed")
        .withArgs(entity2.address, await time.latest());

        expect(await feedbackNFT.isListedEntity(entity2.address)).to.be.true;
    });

    it("Should prevent non-owner from listing an entity", async function () {
      await expect(
        feedbackNFT.connect(user1).listEntity(entity2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent listing an already listed entity", async function () {
      await expect(
        feedbackNFT.connect(owner).listEntity(entity1.address)
      ).to.be.revertedWith("Entity already listed");
    });

    it("Should allow owner to delist an entity", async function () {
      await expect(feedbackNFT.connect(owner).delistEntity(entity1.address))
        .to.emit(feedbackNFT, "EntityDelisted")
        .withArgs(entity1.address, await time.latest());

        expect(await feedbackNFT.isListedEntity(entity1.address)).to.be.false;
    });
  });

  describe("Feedback Submission", function () {
    it("Should allow users to submit valid feedback", async function () {
      const feedbackText = "Great service!";
      const rating = 9;

      // Use await expect(...).to.emit pattern
      await expect(feedbackNFT.connect(user1).giveFeedback(entity1.address, feedbackText, rating))
        .to.emit(feedbackNFT, "FeedbackGiven")
        .withArgs(
          entity1.address,
          user1.address,
          feedbackText,
          rating,
          await time.latest()
        );

      // Additional verification of state changes
      const feedback = await feedbackNFT.getFeedbackForEntity(entity1.address);
      expect(feedback[0].givenBy).to.equal(user1.address);
      expect(feedback[0].feedbackText).to.equal(feedbackText);
      expect(feedback[0].rating).to.equal(rating);

    });

    it("Should prevent feedback submission for unlisted entities", async function () {
      await expect(
        feedbackNFT.connect(user1).giveFeedback(entity2.address, "Test", 8)
      ).to.be.revertedWith("Entity not listed for feedback");
    });

    it("Should prevent self-rating", async function () {
      await expect(
        feedbackNFT.connect(entity1).giveFeedback(entity1.address, "Test", 10)
      ).to.be.revertedWith("Cannot rate yourself");
    });

    it("Should prevent duplicate ratings from same user", async function () {
      await feedbackNFT.connect(user1).giveFeedback(entity1.address, "Test 1", 8);
      await expect(
        feedbackNFT.connect(user1).giveFeedback(entity1.address, "Test 2", 9)
      ).to.be.revertedWith("Already rated this entity");
    });

    it("Should enforce feedback limit per user", async function () {
      // List multiple entities
      for(let i = 0; i < INITIAL_FEEDBACK_LIMIT; i++) {
        const newEntity = await ethers.Wallet.createRandom();
        await feedbackNFT.connect(owner).listEntity(newEntity.address);
        await feedbackNFT.connect(user1).giveFeedback(newEntity.address, "Test", 8);
      }

      const extraEntity = await ethers.Wallet.createRandom();
      await feedbackNFT.connect(owner).listEntity(extraEntity.address);
      await expect(
        feedbackNFT.connect(user1).giveFeedback(extraEntity.address, "Test", 8)
      ).to.be.revertedWith("Feedback limit reached");
    });
  });

  describe("NFT Awards", function () {
    it("Should award NFT when average rating threshold is met", async function () {
      // Submit 3 high ratings
      for(let i = 0; i < 3; i++) {
        const user = [user1, user2, user3][i];
        await feedbackNFT.connect(user).giveFeedback(entity1.address, "Excellent!", 10);
      }

      expect(await feedbackNFT.balanceOf(entity1.address)).to.equal(1);
    });

    it("Should not award NFT when average rating is below threshold", async function () {
      // Submit 3 low ratings
      for(let i = 0; i < 3; i++) {
        const user = [user1, user2, user3][i];
        await feedbackNFT.connect(user).giveFeedback(entity1.address, "Poor service", 5);
      }

      expect(await feedbackNFT.balanceOf(entity1.address)).to.equal(0);
    });

    it("Should not award multiple NFTs to the same entity", async function () {
      // Submit 6 high ratings
      for(let i = 0; i < 3; i++) {
        const user = [user1, user2, user3][i];
        await feedbackNFT.connect(user).giveFeedback(entity1.address, "Excellent!", 10);
      }

      expect(await feedbackNFT.balanceOf(entity1.address)).to.equal(1);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await feedbackNFT.connect(user1).giveFeedback(entity1.address, "Good", 8);
      await feedbackNFT.connect(user2).giveFeedback(entity1.address, "Great", 9);
    });

    it("Should return correct feedback list", async function () {
      const feedbacks = await feedbackNFT.getFeedbackForEntity(entity1.address);
      expect(feedbacks.length).to.equal(2);
      expect(feedbacks[0].rating).to.equal(8);
      expect(feedbacks[1].rating).to.equal(9);
    });

    it("Should calculate average rating correctly", async function () {
      const avgRating = await feedbackNFT.getAverageRating(entity1.address);
      expect(avgRating).to.equal(8); // (8 + 9) / 2 = 8.5, but solidity rounds down
    });

    it("Should return detailed rating information", async function () {
      const [totalRating, numOfRatings, receivedNFT, lastUpdateBlock] = 
        await feedbackNFT.getEntityRatingDetails(entity1.address);
      
      expect(totalRating).to.equal(17); // 8 + 9
      expect(numOfRatings).to.equal(2);
      expect(receivedNFT).to.equal(false);
      expect(lastUpdateBlock).to.be.gt(0);
    });
  });

  describe("Administrative Functions", function () {
    it("Should allow owner to update feedback limit", async function () {
      const newLimit = 10;
      await expect(feedbackNFT.connect(owner).setFeedbackLimit(newLimit))
        .to.emit(feedbackNFT, "FeedbackLimitUpdated")
        .withArgs(newLimit);
      expect(await feedbackNFT.feedbackLimit()).to.equal(newLimit);
    });

    it("Should allow owner to update rating threshold", async function () {
      const newThreshold = 7;
      await expect(feedbackNFT.connect(owner).setRatingThreshold(newThreshold))
        .to.emit(feedbackNFT, "RatingThresholdUpdated")
        .withArgs(newThreshold);
      expect(await feedbackNFT.ratingThreshold()).to.equal(newThreshold);
    });

    it("Should allow owner to pause and unpause the contract", async function () {
      await expect(feedbackNFT.connect(owner).togglePause())
        .to.emit(feedbackNFT, "ContractPaused")
        .withArgs(true);

      await expect(
        feedbackNFT.connect(user1).giveFeedback(entity1.address, "Test", 8)
      ).to.be.revertedWith("Contract is paused");

      await expect(feedbackNFT.connect(owner).togglePause())
        .to.emit(feedbackNFT, "ContractPaused")
        .withArgs(false);
    });
  });

  describe("Edge Cases and Error Handling", function () {
    it("Should handle empty feedback text", async function () {
      await expect(
        feedbackNFT.connect(user1).giveFeedback(entity1.address, "", 8)
      ).to.be.revertedWith("Invalid feedback length");
    });

    it("Should handle invalid rating values", async function () {
      await expect(
        feedbackNFT.connect(user1).giveFeedback(entity1.address, "Test", 0)
      ).to.be.revertedWith("Rating must be between 1 and 10");

      await expect(
        feedbackNFT.connect(user1).giveFeedback(entity1.address, "Test", 11)
      ).to.be.revertedWith("Rating must be between 1 and 10");
    });

    it("Should handle very long feedback text", async function () {
      const longText = "a".repeat(1001);
      await expect(
        feedbackNFT.connect(user1).giveFeedback(entity1.address, longText, 8)
      ).to.be.revertedWith("Invalid feedback length");
    });
  });
});