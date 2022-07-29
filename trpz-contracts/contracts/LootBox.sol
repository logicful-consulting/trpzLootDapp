//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract lootBoxes is ERC721, AccessControl {
    uint256 public launchTime;
    uint256 public cooldownTime;
    uint256 public boxCount;

    /// @notice Base URI for metadata
    string public _prefixURI;

    bool public paused;
    uint64 public boxesAvailable;
    address public trpzToken;
    uint64 public maxClaims;
    uint256 public boxCost;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    mapping(uint256 => mapping(address => uint64)) public ownerClaimsByLaunch;
    mapping(address => uint256) public addressCooldown;

    // ======================== MODIFIERS ========================== //
    modifier whenNotPaused() {
        require(!paused, "Paused");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _trpzToken
    ) ERC721(_name, _symbol) {
        trpzToken = _trpzToken;
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    ///////////////////////////// USER LOGIC //////////////////////////////
    function mintBox() external whenNotPaused {
        require(boxesAvailable > 0, "NO_MORE BOXES");
        require(
            ownerClaimsByLaunch[launchTime][msg.sender] < maxClaims,
            "MAX_CLAIMS_REACHED"
        );
        require(
            addressCooldown[msg.sender] < block.timestamp,
            "COOLDOWN_ACTIVE"
        );
        boxesAvailable--;
        ownerClaimsByLaunch[launchTime][msg.sender] += 1;
        addressCooldown[msg.sender] = block.timestamp + cooldownTime;
        boxCount++;
        _mint(msg.sender, boxCount);
        IERC20(trpzToken).transferFrom(msg.sender, address(this), boxCost);
    }

    /// @notice Overrode the function to remove tokenId.toString() as uri is same
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI)) : "";
    }

    /// @notice Returning the baseURI
    function _baseURI() internal view override returns (string memory) {
        return _prefixURI;
    }

    function setBaseURI(string memory _baseUri) external whenNotPaused {
        _prefixURI = _baseUri;
    }

    /////////////////////////////// ADMIN LOGIC ///////////////////////////////
    /// @notice burn function for the loot boxes
    function burnBox(uint256 _tokenId) external whenNotPaused {
        require(msg.sender == ownerOf(_tokenId), "Not owner");
        _burn(_tokenId);
    }

    /// @notice change the max number of boxes an address can mint in a batch
    function changeMax(uint64 _maxClaims) external whenNotPaused {
        require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
        maxClaims = _maxClaims;
    }

    function changeBoxCost(uint256 _price) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
        boxCost = _price;
    }

    function changeCooldown(uint256 _time) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
        cooldownTime = _time;
    }

    /// @dev Launch function for each round of boxes
    function launchBox(uint64 _number) external whenNotPaused {
        require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
        boxesAvailable = _number;
        launchTime = block.timestamp;
    }

    /// @dev Pause function for the main functionality in contract
    function pauseContract() external {
        require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
        paused = !paused;
    }

    /// @notice Burn the TRPZ balance from the contract
    function withdrawTRPZ() external {
        require(hasRole(ADMIN_ROLE, msg.sender), "You are not an admin");
        require(
            IERC20(trpzToken).balanceOf(address(this)) > 0,
            "No TRPZ to withdraw"
        );
        IERC20(trpzToken).transfer(
            msg.sender,
            IERC20(trpzToken).balanceOf(address(this))
        );
    }

    /// @notice Override to make joint function compatible with ERC721 and AccessControl
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
