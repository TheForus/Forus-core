// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

// Import the interfaces for ERC20 and ERC721 tokens

import "./IERC20.sol";
import "./IERC721.sol";

/**
 * @title Logs
 * @dev The Logs contract allows senders to publish their public key (ephemeral keys) on the blockchain, consisting of the parameters r, s, and v.
 * These keys allow the receiver to generate the private key associated with his stealth address.
 * Users publish their public keys by invoking the appropriate functions in the contract.
 * The contract maintains a log of published keys and keeps track of the total funds received.
 * Users can transfer coins, tokens, and Non fungible tokens to a designated recipient stealth address, authorized by their published keys.
 */

contract Logs {
    // Define a struct to represent ephemeral public keys
    // ephemral public key is the combination of r s and v where
    // r and s is are 32bytes represent ephemral public key where as v is the 2 bytes
    // shared secret key prefixed with ephemeral public key

    struct publickeys {
        bytes32 r;
        bytes32 s;
        bytes2 v;
    }

    //  @notice Define variables to keep track of the total funds received and the length of publick keys

    uint256 internal totalFunds;
    uint256 internal limit;

    //@notice Define an event to log the publication of public keys (ephemeral public keys)

    event publicKeys(bytes32 r, bytes32 s, bytes2 v, uint256 indexed timestamp);

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
     * @return The total number of addresses.

     */
    function getTotalAddresses() public view returns (uint256) {
        return limit;
    }

    /**
     * @return The total volume of funds received.
     */

    function getTotalVolume() public view returns (uint256) {
        return totalFunds;
    }

    /**
     * @notice private function to publish ephemeral public keys in logs array
     * @dev ephemeral public key is made up of r s v paramaters
     * @param r  & s 32 bytes  of the ephemeral public key
     * @param v first 2 bytes prefixed with ephemeral public key.
     */
    function publishEphemeralkeys(bytes32 r, bytes32 s, bytes2 v) private {
        logs.push(publickeys(r, s, v));
    }

    receive() external payable {}

    function getContractbalance() public view returns (uint256) {
        return address(this).balance;
    }

    function ephKeysLength() public view returns (uint256) {
        return logs.length;
    }

    function deductTransactionFee(uint _amount) internal returns (uint256) {
        uint256 amountToTransfer = (_amount * 10) / 10000;
        (bool sent, ) = address(this).call{value: amountToTransfer}("");
        require(sent, "Failed to send Ether");
        return amountToTransfer;
    }

    /**
     // @notice transfers funds to a target stealth address.
     * @param target: The target address (i.e stealth address) to receive the funds.
     */

    function Transfer(
        bytes32 r,
        bytes32 s,
        bytes2 v,
        address payable target
    ) public payable  {
        // Check that the value being transferred is greater than 0 and that the target address is not empty
        require(msg.value > 0, "amount should be more than 0");
        require(target != address(0x0), " Target address required");

        deductTransactionFee(msg.value);

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
    // @notice transfers funds to the target stealth address.
     * @param token : The address of the ERC20 token contract.
     * @param target : The target address (stealth address) to receive the tokens.
     * @param amount : The amount of tokens to transfer.
     */

    function TransferToken(
        bytes32 r,
        bytes32 s,
        bytes2 v,
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

        if (IERC20(token).allowance(msg.sender, address(this)) < amount) {
            revert("Not enough allowance");
        }

        deductTransactionFee(amount);

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

    // /**
    //  * @notice transfers Non Fungible tokens (NFTs) to a target address.
    //  * @param NftToken : The address of the ERC721 token contract.
    //  * @param target : The target address (stealth address) to receive the (NFT) token .
    //  * @param tokenId : The ID of the (NFT) to transfer.
    //  */

    function TransferNft(
        bytes32 r,
        bytes32 s,
        bytes2 v,
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
            revert("Not enough approval");
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

    function getEphKeys(
        uint256 initVal
    ) public view returns (publickeys[10] memory) {
        publickeys[10] memory Keys;

        uint8 val = 10;

        uint256 end = initVal + val;
        uint256 finalVal = (ephKeysLength() < end) ? ephKeysLength() : end;

        for (uint256 i = initVal; i < finalVal; i++) {
            Keys[i - initVal] = logs[i];
        }

        return Keys;
    }

    //     function getEphKeys(uint256 initVal)
    //     public
    //     view
    //     returns (publickeys[10] memory)
    // {
    //     publickeys[10] memory Keys;
    //     uint8 val = 10;

        // assembly {
        //     // Initialize variables
        //     let end := add(initVal, val)
        //     let finalVal := min(ephKeysLength(), end)

        //     // Loop over the range [initVal, finalVal)
        //     for { let i := initVal } lt(i, finalVal) { i := add(i, 1) } {
        //         // Retrieve logs[i] and store it in Keys[i - initVal]
        //         mstore(add(Keys, sub(i, initVal)), sload(add(logs_slot, i)))
        //     }
        // }

    //     return Keys;
    // }
}
