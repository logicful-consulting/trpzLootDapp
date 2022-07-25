//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// contract LootBoxes is AccessControl, ReentrancyGuard {
//     uint256 public launchtime;
//     bool paused;
//     uint64 public boxesAvailable;
//     address public croAddress;
//     address public trpzToken;
//     uint64 public maxClaims;
//     bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

//     enum Boxes {
//         Low,
//         Mid,
//         High
//     }

//     struct RewardBoxes {
//         uint64 croCost;
//         uint64 croMin;
//         uint64 croMax;
//         uint64 trpzCost;
//         uint64 trpzMin;
//         uint64 trpzMax;
//         address[] nftArray;
//     }

//     struct Claim {
//         address nftContract;
//         uint256 tokenId;
//     }

//     mapping(Boxes => RewardBoxes) public lootToRewards;
//     mapping(Boxes => Claim) public lootToClaim;
//     mapping(Boxes => uint64[]) public availableRewards;
//     mapping(uint256 => mapping(address => uint64)) public ownerClaimsByLaunch;
//     mapping(address => uint256) public ownerCROClaim;
//     mapping(address => uint256) public ownerTRPZClaim;
//     mapping(address => Claim[]) public ownerNFTClaim;
//     mapping(address => uint64) public ownerNFTClaimCount;
//     mapping(address => uint256[]) public contractToTokenIds;

//     // ======================== MODIFIERS ========================== //
//     modifier whenNotPaused() {
//         require(!paused, "Paused");
//         _;
//     }

//     constructor(address _croAddress, address _trpzToken) {
//         croAddress = _croAddress;
//         trpzToken = _trpzToken;
//         _setupRole(ADMIN_ROLE, msg.sender);
//     }

//     // =========================== EXTERNAL  FUNCTIONS =============== //
//     /// @dev Function to enter each loot batch
//     function claimLoot(Boxes _box) external payable nonReentrant {
//         require(ownerClaimsByLaunch[launchTime][msg.sender] < maxClaims, "Claimed max");
//         require(
//             msg.value > lootToRewards[_box].croCost ||
//                 lootToRewards[_box].trpzCost,
//             "Not enough sent"
//         );

//         /// Would you ever get a zero value? !!!
//         uint256 randNumOne = _getRandomNumber(availableRewards[_box].length);
//         randNonce++;
//         uint256 randNumTwo;

//         if(availableRewards[_box][randNumOne] == 0) {
//             randNumTwo = _getRandomNumber(100);
//             randNonce++;
//             uint256 range = (lootToRewards[_box].croMax - lootToRewards[_box].croMin);
//             uint256 reward = (lootToRewards[_box].croMin + ((range * 100) / randNumTwo));
//             ownerCROClaim += reward;
//         } if(availableRewards[_box][randNumOne] == 1) {
//             randNumTwo = _getRandomNumber(100);
//             randNonce++;
//             uint256 range = (lootToRewards[_box].trpzMax - lootToRewards[_box].trpzMin);
//             uint256 reward = (lootToRewards[_box].trpzMin + ((range * 100) / randNumTwo));
//             ownerTRPZClaim += reward;
//         } if(availableRewards[_box][randNumOne] == 2) {
//             randNumTwo = _getRandomNumber(lootToRewards[_box].nftArray.length-1);
//             randNonce++;
//             /// CREATE A GETTER FOR THE LENGTH TO MAKE MORE READABLE
//             randNumOne = _getRandomNumber(contractToTokenIds[lootToRewards[_box].nftArray[randNumTwo]].length - 1);
//             /// PUSH THE ID TO THE OWNERS ARRAY

//             // REMOVE THE ID FROM THE ARRAY BY DELETING LAST OR SWAP
//             if(randNumOne == contractToTokenIds[lootToRewards[_box].nftArray[randNumTwo]].length - 1) {
//                 delete contractToTokenIds[lootToRewards[_box].nftArray[randNumTwo];
//             } else {
//                 contractToTokenIds[lootToRewards[_box].nftArray[randNumTwo]] = contractToTokenIds[lootToRewards[_box].nftArray[contractToTokenIds[lootToRewards[_box].nftArray[randNumTwo]].length - 1]];
//                 delete contractToTokenIds[lootToRewards[_box].nftArray[randNumTwo]].length - 1;
//             }
//             /// IF THE NFT HAS NO TOKEN IDS DELETE FROM REWARD ARRAY
//             /// USE A GETTER AGAIN TO MAKE MORE READABLE
//             if(contractToTokenIds[lootToRewards[_box].nftArray[randNumTwo]].length == 0) {
//                 if(randNumTwo == lootToRewards[_box].nftArray.length-1) {
//                     delete lootToRewards[_box].nftArray[randNumTwo];
//                 } else {
//                     lootToRewards[_box].nftArray[randNumTwo] = lootToRewards[_box].nftArray[ootToRewards[_box].nftArray[lootToRewards[_box].nftArray.length-1]]
//                     delete lootToRewards[_box].nftArray[lootToRewards[_box].nftArray.length-1]
//                 }
//             }
//             ownerNFTClaimCount += 1;
//         }

//         ownerClaimsByLaunch[launchTime][msg.sender] +=1;

//         /// If sequence to update rewards if they don't match
//         uint64[] array = _checkAvailableRewards(0);
//         if(array != availableRewards[0]) {
//             availableRewards[2] = array;
//         } else {
//             array = _checkAvailableRewards(1);
//             if(array != availableRewards[1]) {
//                 availableRewards[2] = array;
//         } else {
//             array = _checkAvailableRewards(2);
//             if(array != availableRewards[2]) {
//                 availableRewards[2] = array;
//         }
//         }
//         }

//         // TRANSFER FUNDS TO THE CONTRACT
//         if (msg.value >= lootToRewards[_box].croCost) {
//             bool success = IERC20(croAddress).transfer(
//                 address(this),
//                 lootToRewards[_box].croCost
//             );
//             require(success, "Transfer did not work");
//         } else {
//             bool success = IERC20(trpzToken).transfer(
//                 address(this),
//                 lootToRewards[_box].trpzCost
//             );
//             require(success, "Transfer did not work");
//         }

//         /// IF NFT need to add to Claim + add to count
//     }

//     /// @dev Receiver function for ERC721
//     /// We add token ids to the respective contract array
//     function onERC721Received(
//         address _operator,
//         address _from,
//         uint256 _tokenId,
//         bytes memory
//     ) public virtual whenNotPaused returns (bytes4) {
//         contractToTokenIds[msg.sender].push(_tokenId);
//         return this.onERC721Received.selector;
//     }

//     function claimTRPZ() external nonReentrant {
//         require(ownerTRPZClaim[msg.sender] > 0, "No CRO to claim");
//         uint256 trpzClaim = ownerTRPZClaim[msg.sender];
//         delete ownerTRPZClaim[msg.sender];
//         bool success = IERC20(trpzToken).transfer(msg.sender, trpzClaim);
//         require(success, "Transfer did not work");
//     }

//     function claimCRO() external nonReentrant {
//         require(ownerCROClaim[msg.sender] > 0, "No CRO to claim");
//         uint256 croClaim = ownerCROClaim[msg.sender];
//         delete ownerCROClaim[msg.sender];
//         bool success = IERC20(croAddress).transfer(msg.sender, croClaim);
//         require(success, "Transfer did not work");
//     }

//     function claimNFTs() external nonReentrant {
//         require(ownerNFTClaim[msg.sender].length > 0, "No NFT claims");
//         uint64 claims = ownerNFTClaimCount[msg.sender];

//         for (uint256 i; i < claims; i++) {
//             IERC721(ownerNFTClaim[msg.sender][i].nftContract).safeTransferFrom(
//                 address(this),
//                 msg.sender,
//                 ownerNFTClaim[msg.sender][i].tokenId
//             );
//         }
//         delete ownerNFTClaimCount[msg.sender];
//         delete ownerNFTClaim[msg.sender];
//     }

//     // ========================= INTERNAL FUNCTIONS ============== //
//     /// @dev Random number getter for the reward distribution
//     function _getRandomNumber(uint256 _max) internal view returns (uint256) {
//         keccak256(abi.encodePacked(blockhash(block.number + 1),msg.sender, randNonce)) % _max;
//     }

//     /// @dev Compares the min requirements for each box
//     /// If the min is not met then no num is pushed to array + mismatch will update
//     function _getAvailableRewards(Boxes _box) internal view return (uint64[]) {
//         uint64[] array;
//         if(IERC20(croAddress).balanceOf(address(this)) > lootToRewards[_box].croMin) {
//             array.push(0)
//         }
//         if(IERC20(trpzToken).balanceOf(address(this)) > lootToRewards[_box].croMin) {
//             array.push(1)
//         }
//         if(lootToRewards[_box].nftArray.length > 0) {
//             array.push(2)
//         }
//         return array;
//     }

//     // =========================== ADMIN FUNCTIONS =============== //
//     /// @dev Dual withdrawal function for TRPZ & CRO
//     function withdrawFunds() external {
//         require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
//         bool success = IERC20(trpzToken).transfer(msg.sender, IERC20(trpzToken).balanceOf(address(this));
//         require(success, "Transfer did not work");
//         bool success = IERC20(croAddress).transfer(msg.sender, IERC20(croAddress).balanceOf(address(this)););
//         require(success, "Transfer did not work");
//     }

//     /// @dev Launch function for each round of boxes
//     function launchBoxes(uint64 _number) external whenNotPaused {
//         require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
//         boxesAvailable = _number;
//         launchtime = block.timestamp;
//     }

//     /// @dev Adds loot to each box
//     // Need a way to check the input values and add items to an array!!!
//     function addLootToBoxes() external {
//         require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
//     }

//     /// @dev Pause function for the main functionality in contract
//     function pauseContract() external {
//         require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
//         paused = !paused;
//     }

//     /// @dev Setter for the TRPZ token address
//     function setTrpzTokenAddr(address _addr) external {
//         require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
//         trpzToken = _addr;
//     }

//     /// @dev Setter for the TRPZ token address
//     function setCROTokenAddr(address _addr) external {
//         require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
//         croAddress = _addr;
//     }

//     // ======================== GETTER FUNCTIONS ================== //
//     // function getRewardBoxes() external view returns (uint64[] memory) {
//     //     return ownerToBoosts[msg.sender];
//     // }
// }
