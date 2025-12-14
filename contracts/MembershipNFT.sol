// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MembershipNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    IERC20 public usdcToken;
    
    struct Membership {
        uint256 membershipId;
        address creator;
        uint256 price; // in USDC (6 decimals)
        bool isActive;
        bool isRecurring; // monthly or one-time
        uint256 expiryDuration; // in seconds (0 for one-time)
        string metadataURI;
        uint256 totalMembers;
    }
    
    struct MemberToken {
        uint256 membershipId;
        uint256 expiryTime; // 0 for one-time memberships
        bool isValid;
    }
    
    mapping(uint256 => Membership) public memberships;
    mapping(uint256 => MemberToken) public memberTokens; // tokenId => MemberToken
    mapping(address => mapping(uint256 => bool)) public hasMembership; // user => membershipId => hasAccess
    mapping(uint256 => uint256[]) public membershipTokenIds; // membershipId => tokenIds[]
    
    uint256 public totalMemberships;
    
    event MembershipCreated(
        uint256 indexed membershipId,
        address indexed creator,
        uint256 price,
        bool isRecurring
    );
    
    event MembershipPurchased(
        uint256 indexed membershipId,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );
    
    event MembershipRenewed(
        uint256 indexed membershipId,
        uint256 indexed tokenId,
        address indexed member
    );
    
    constructor(address _usdcToken) ERC721("CryptoMembership", "CMEM") Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        _tokenIdCounter = 1;
    }
    
    function createMembership(
        uint256 _price,
        bool _isRecurring,
        uint256 _expiryDuration,
        string memory _metadataURI
    ) external returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        
        uint256 membershipId = totalMemberships + 1;
        totalMemberships++;
        
        memberships[membershipId] = Membership({
            membershipId: membershipId,
            creator: msg.sender,
            price: _price,
            isActive: true,
            isRecurring: _isRecurring,
            expiryDuration: _expiryDuration,
            metadataURI: _metadataURI,
            totalMembers: 0
        });
        
        emit MembershipCreated(membershipId, msg.sender, _price, _isRecurring);
        return membershipId;
    }
    
    function purchaseMembership(uint256 _membershipId) external nonReentrant returns (uint256) {
        Membership storage membership = memberships[_membershipId];
        require(membership.isActive, "Membership is not active");
        require(!hasMembership[msg.sender][_membershipId] || membership.isRecurring, "Already a member");
        
        // Transfer USDC from buyer to creator
        require(
            usdcToken.transferFrom(msg.sender, membership.creator, membership.price),
            "USDC transfer failed"
        );
        
        uint256 tokenId = _tokenIdCounter++;
        uint256 expiryTime = 0;
        
        if (membership.isRecurring) {
            expiryTime = block.timestamp + membership.expiryDuration;
        }
        
        memberTokens[tokenId] = MemberToken({
            membershipId: _membershipId,
            expiryTime: expiryTime,
            isValid: true
        });
        
        hasMembership[msg.sender][_membershipId] = true;
        membership.totalMembers++;
        membershipTokenIds[_membershipId].push(tokenId);
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, membership.metadataURI);
        
        emit MembershipPurchased(_membershipId, tokenId, msg.sender, membership.price);
        return tokenId;
    }
    
    function renewMembership(uint256 _tokenId) external nonReentrant {
        require(ownerOf(_tokenId) == msg.sender, "Not token owner");
        MemberToken storage memberToken = memberTokens[_tokenId];
        require(memberToken.isValid, "Token is invalid");
        
        Membership storage membership = memberships[memberToken.membershipId];
        require(membership.isRecurring, "Not a recurring membership");
        require(block.timestamp >= memberToken.expiryTime, "Membership not expired");
        
        // Transfer USDC for renewal
        require(
            usdcToken.transferFrom(msg.sender, membership.creator, membership.price),
            "USDC transfer failed"
        );
        
        memberToken.expiryTime = block.timestamp + membership.expiryDuration;
        
        emit MembershipRenewed(memberToken.membershipId, _tokenId, msg.sender);
    }
    
    function checkAccess(address _user, uint256 _membershipId) external view returns (bool) {
        if (!hasMembership[_user][_membershipId]) {
            return false;
        }
        
        // Check if user owns a valid token for this membership
        uint256[] memory tokenIds = membershipTokenIds[_membershipId];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (ownerOf(tokenIds[i]) == _user) {
                MemberToken memory memberToken = memberTokens[tokenIds[i]];
                if (memberToken.isValid) {
                    if (!memberships[_membershipId].isRecurring) {
                        return true; // One-time membership, always valid
                    }
                    if (block.timestamp < memberToken.expiryTime) {
                        return true; // Recurring membership, not expired
                    }
                }
            }
        }
        return false;
    }
    
    function getUserMemberships(address _user) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](totalMemberships);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= totalMemberships; i++) {
            if (!hasMembership[_user][i]) {
                continue;
            }
            
            // Check if user owns a valid token for this membership
            uint256[] memory tokenIds = membershipTokenIds[i];
            bool hasValidToken = false;
            
            for (uint256 j = 0; j < tokenIds.length; j++) {
                if (ownerOf(tokenIds[j]) == _user) {
                    MemberToken memory memberToken = memberTokens[tokenIds[j]];
                    if (memberToken.isValid) {
                        if (!memberships[i].isRecurring) {
                            hasValidToken = true;
                            break;
                        }
                        if (block.timestamp < memberToken.expiryTime) {
                            hasValidToken = true;
                            break;
                        }
                    }
                }
            }
            
            if (hasValidToken) {
                result[count] = i;
                count++;
            }
        }
        
        // Resize array
        uint256[] memory finalResult = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }
        
        return finalResult;
    }
    
    function getMembership(uint256 _membershipId) external view returns (Membership memory) {
        return memberships[_membershipId];
    }
    
    function updateMembershipStatus(uint256 _membershipId, bool _isActive) external {
        require(memberships[_membershipId].creator == msg.sender, "Not the creator");
        memberships[_membershipId].isActive = _isActive;
    }
}

