// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// Import the interfaces for ERC20 and ERC721 tokens

import "./IERC20.sol";
import "./IERC721.sol";

/**
 * @title Logs
 * @dev The Logs contract allows senders to publish their public key (ephemeral keys) on the blockchain, consisting of the parameters r, s, and v.
 * These keys allow the receiver to generate the private key associated with his stealth address , provide an additional layer of security.
 * Users publish their public keys by invoking the appropriate functions in the contract.
 * The contract maintains a log of published keys and keeps track of the total funds received.
 * Users can transfer coins, tokens, and Non fungible tokens to a designated recipient stealth address, authorized by their published keys.
 */

contract Logs {
    // Define a struct to represent public keys
    struct publickeys {
        bytes32 r;
        bytes32 s;
        bytes4 v;
    }

    //  @notice Define variables to keep track of the total funds received and the limit

    uint256 internal totalFunds;
    uint256 internal limit;

    //@notice Define an event to log the publication of public keys

    event publicKeys(bytes32 r, bytes32 s, bytes4 v, uint256 indexed timestamp);

    //  @notice Define a variable to store the owner of the contract

    address private owner;

    //@notice Define an array to store the logs of published public keys

    publickeys[] public logs;

    /**
     * @dev Constructor function that sets the owner of the contract.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice returns the total number of addresses.
     * @return The total number of addresses.
     */
    function getTotalAddresses() public view returns (uint256) {
        return limit;
    }

    /**
     * @notice returns the total volume of funds received.
     * @return The total volume of funds received.
     */
    function getTotalVolume() public view returns (uint256) {
        return totalFunds;
    }

    

    /**
     * @notice private function to publish ephemeral public keys in logs array
     * @dev ephemeral public key is made up of r s v paramaters
     * @param r 32 bytes of the ephemeral public key
     * @param s last 32 bytes of the ephemeral public key .
     * @param v first 4 bytes the ephemeral public key.
     */
    function publishEphemeralkeys(bytes32 r, bytes32 s, bytes4 v) private {
        logs.push(publickeys(r, s, v));
    }

    /**
     // @notice transfers funds to a target stealth address.
     * @param target The target address to receive the funds.
     */
    function Transfer(
        bytes32 r,
        bytes32 s,
        bytes4 v,
        address payable target
    ) public payable {
        // Check that the value being transferred is greater than 0 and that the target address is not empty
        require(msg.value > 0, "amount should be more than 0");
        require(target != address(0x0), " Target address required");

        // Publish the ephemeral keys on chain
        publishEphemeralkeys(r, s, v);

        // @notice Transfer the funds to the targeted stealth address
        (bool sent, ) = target.call{value: msg.value}("");
        require(sent, " Failed to send ");

        // Perform calculations and updates using temporary variables

        uint256 updatedTotalFunds = totalFunds + msg.value;
        uint256 updatedLimit = limit + 1;

        // Update storage variables with the updated values

        totalFunds = updatedTotalFunds;
        limit = updatedLimit;

        // Emit an event to log the publication of public keys
        emit publicKeys(r, s, v, block.timestamp);
    }

    /**
    // @notice transfers funds to a target stealth address.
     * @param token The address of the ERC20 token contract.
     * @param target The target address (stealth address) to receive the tokens.
     * @param amount The amount of tokens to transfer.
     */

    function TransferToken(
        bytes32 r,
        bytes32 s,
        bytes4 v,
        address token,
        address target,
        uint256 amount
    ) external {
        // Check that the amount being transferred is greater than 0 and that both token and target addresses are not empty.

        require(amount > 0, "Amount should be more than 0");
        require(token != address(0x0), " Enter the token address");
        require(target != address(0x0), " Enter the receipent address");

        require(
            IERC20(token).balanceOf(msg.sender) >= amount,
            "Not enough tokens"
        );

        if (IERC20(token).allowance(address(this), msg.sender) < amount) {
            IERC20(token).approve(msg.sender, amount);
        }

        // Publish the ephemeral keys.
        publishEphemeralkeys(r, s, v);

        // @notice Transfer tokens from sender's account to target account.
        IERC20(token).transferFrom(msg.sender, target, amount);

        // Perform calculations and updates using temporary variables.

        uint256 updatedTotalFunds = totalFunds + amount;
        uint256 updatedLimit = limit + 1;

        // Update storage variables with the updated values.

        totalFunds = updatedTotalFunds;
        limit = updatedLimit;

        // Emit an event to log the publication of public keys.
        emit publicKeys(r, s, v, block.timestamp);
    }

    /**
     * @notice transfers Non Fungible tokens (NFTs) to a target address.
     * @param NftToken The address of the ERC721 token contract.
     * @param target The target address (stealth address) to receive the (NFT) token .
     * @param tokenId The ID of the token (NFT) to transfer.
     */
    
    function TransferNft(
        bytes32 r,
        bytes32 s,
        bytes4 v,
        address NftToken,
        address target,
        uint256 tokenId
    ) external {
        // Check that both NftToken and target addresses are not empty.
        require(NftToken != address(0x0), " Enter the token address");
        require(target != address(0x0), " Target address required");

        require(
            IERC721(NftToken).ownerOf(tokenId) == msg.sender,
            "Not enough tokens"
        );

        // check if the nft approval belongs to the owner

        if (IERC721(NftToken).getApproved(tokenId) != address(this)) {
            IERC721(NftToken).approve(msg.sender, tokenId);
        }

        // Publish the ephemeral keys.
        publishEphemeralkeys(r, s, v);

        // @notice Transfer Non Fungible tokens (NFT) from sender's account to target account.
        IERC721(NftToken).transferFrom(msg.sender, target, tokenId);

        // Perform calculations and updates using temporary variables.

        uint256 updatedTotalFunds = totalFunds + tokenId;
        uint256 updatedLimit = limit + 1;

        // Update storage variables with the updated values.

        totalFunds = updatedTotalFunds;
        limit = updatedLimit;

        // Emit an event to log the publication of public keys.
        emit publicKeys(r, s, v, block.timestamp);
    }
}
