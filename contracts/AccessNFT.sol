// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessNFT is ERC721, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("FeedbackAccessNFT", "FANFT") {
        tokenCounter = 0;
    }

    function mintNFT(address to) public onlyOwner {
        _safeMint(to, tokenCounter);
        tokenCounter++;
    }

    function hasAccess(address user) public view returns (bool) {
        return balanceOf(user) > 0;
    }
}
