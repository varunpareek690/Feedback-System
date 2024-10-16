// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FeedbackNFT is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    struct Feedback {
        address givenBy;
        string feedbackText;
        uint8 rating;
        uint256 timestamp;
    }

    struct RatingInfo {
        uint256 totalRating;
        uint256 numOfRatings;
        bool receivedNFT;
        uint256 lastUpdateBlock;
    }

    // State variables
    Counters.Counter private _tokenIdCounter;
    uint256 public constant MAX_RATING = 10;
    uint256 public constant MIN_RATING = 1;
    uint256 public constant MIN_RATINGS_FOR_NFT = 3;
    
    mapping(address => Feedback[]) public feedbacks;
    mapping(address => RatingInfo) public ratings;
    mapping(address => uint256) public feedbackCountPerUser;
    mapping(address => bool) public isListedEntity;
    mapping(address => mapping(address => bool)) public hasUserRatedEntity;

    uint256 public feedbackLimit;
    uint256 public ratingThreshold;
    bool public isPaused;

    // Events
    event EntityListed(address indexed entity, uint256 timestamp);
    event EntityDelisted(address indexed entity, uint256 timestamp);
    event FeedbackGiven(
        address indexed to, 
        address indexed from, 
        string feedbackText, 
        uint8 rating,
        uint256 timestamp
    );
    event NFTAwarded(address indexed entity, uint256 tokenId, uint256 averageRating);
    event FeedbackLimitUpdated(uint256 newLimit);
    event RatingThresholdUpdated(uint256 newThreshold);
    event ContractPaused(bool isPaused);

    constructor(
        uint256 initialFeedbackLimit,
        uint256 initialRatingThreshold
    ) ERC721("FeedbackNFT", "FBNFT") {
        require(
            initialRatingThreshold >= MIN_RATING && 
            initialRatingThreshold <= MAX_RATING,
            "Invalid rating threshold"
        );
        feedbackLimit = initialFeedbackLimit;
        ratingThreshold = initialRatingThreshold;
    }

    // Modifiers
    modifier onlyListedEntity(address entity) {
        require(isListedEntity[entity], "Entity not listed for feedback");
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    // Admin functions
    function togglePause() external onlyOwner {
        isPaused = !isPaused;
        emit ContractPaused(isPaused);
    }

    function setFeedbackLimit(uint256 newLimit) external onlyOwner {
        require(newLimit > 0, "Limit must be greater than 0");
        feedbackLimit = newLimit;
        emit FeedbackLimitUpdated(newLimit);
    }

    function setRatingThreshold(uint256 newThreshold) external onlyOwner {
        require(
            newThreshold >= MIN_RATING && newThreshold <= MAX_RATING,
            "Invalid rating threshold"
        );
        ratingThreshold = newThreshold;
        emit RatingThresholdUpdated(newThreshold);
    }

    function listEntity(address entity) external onlyOwner {
        require(entity != address(0), "Invalid entity address");
        require(!isListedEntity[entity], "Entity already listed");
        isListedEntity[entity] = true;
        emit EntityListed(entity, block.timestamp);
    }

    function delistEntity(address entity) external onlyOwner {
        require(isListedEntity[entity], "Entity not listed");
        isListedEntity[entity] = false;
        emit EntityDelisted(entity, block.timestamp);
    }

    // Main functions
    function giveFeedback(
        address to,
        string calldata feedbackText,
        uint8 rating
    ) external whenNotPaused nonReentrant onlyListedEntity(to) {
        require(msg.sender != to, "Cannot rate yourself");
        require(!hasUserRatedEntity[msg.sender][to], "Already rated this entity");
        require(bytes(feedbackText).length > 0 && bytes(feedbackText).length <= 1000, 
            "Invalid feedback length");
        require(rating >= MIN_RATING && rating <= MAX_RATING, 
            "Rating must be between 1 and 10");
        require(feedbackCountPerUser[msg.sender] < feedbackLimit, 
            "Feedback limit reached");

        hasUserRatedEntity[msg.sender][to] = true;
        feedbacks[to].push(Feedback({
            givenBy: msg.sender,
            feedbackText: feedbackText,
            rating: rating,
            timestamp: block.timestamp
        }));

        RatingInfo storage ratingInfo = ratings[to];
        ratingInfo.totalRating += rating;
        ratingInfo.numOfRatings += 1;
        ratingInfo.lastUpdateBlock = block.number;

        feedbackCountPerUser[msg.sender] += 1;

        emit FeedbackGiven(to, msg.sender, feedbackText, rating, block.timestamp);

        if (ratingInfo.numOfRatings >= MIN_RATINGS_FOR_NFT) {
            _calculateAverageAndAwardNFT(to);
        }
    }

    function _calculateAverageAndAwardNFT(address to) internal {
        RatingInfo storage ratingInfo = ratings[to];
        if (ratingInfo.receivedNFT) return;

        uint256 averageRating = ratingInfo.totalRating / ratingInfo.numOfRatings;
        if (averageRating >= ratingThreshold) {
            uint256 newTokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(to, newTokenId);
            ratingInfo.receivedNFT = true;
            emit NFTAwarded(to, newTokenId, averageRating);
        }
    }

    // View functions
    function getFeedbackForEntity(address entity) 
        external 
        view 
        returns (Feedback[] memory) 
    {
        return feedbacks[entity];
    }

    function getAverageRating(address entity) 
        external 
        view 
        returns (uint256) 
    {
        RatingInfo memory ratingInfo = ratings[entity];
        if (ratingInfo.numOfRatings == 0) return 0;
        return ratingInfo.totalRating / ratingInfo.numOfRatings;
    }

    function getEntityRatingDetails(address entity)
        external
        view
        returns (
            uint256 totalRating,
            uint256 numOfRatings,
            bool receivedNFT,
            uint256 lastUpdateBlock
        )
    {
        RatingInfo memory ratingInfo = ratings[entity];
        return (
            ratingInfo.totalRating,
            ratingInfo.numOfRatings,
            ratingInfo.receivedNFT,
            ratingInfo.lastUpdateBlock
        );
    }
}