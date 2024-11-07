// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    mapping(address=>bool) public admins;

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    constructor() ERC721("FeedbackAccessNFT", "FANFT") {
        admins[msg.sender] = true;
        tokenCounter = 0;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || owner()==msg.sender, "Not an admin or owner");
        _;
    }

    function addAdmin(address _admin) external onlyOwner{
        require(_admin != address(0),"Invalid address");
        require(!admins[_admin],"Already an admin");

        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin], "Not an admin");

        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }
    function mintNFT(address to) public onlyOwner {
        _safeMint(to, tokenCounter);
        tokenCounter++;
    }
    function isAdmin(address _addr) external view returns (bool) {
        return admins[_addr];
    }


    function hasAccess(address user) public view returns (bool) {
        return balanceOf(user) > 0;
    }
}
