// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

// Import the interfaces for IERC20 and IERC721 tokens

import "./IERC20.sol";
import "./IERC721.sol";

// Import the SafeMath library

import "./SafeMath.sol";

/**
 * @title Logs
 * @dev The Logs contract allows users to publish their public keys onchain,
 * consisting of the parameters x_cor, y_cor, and sharedSecret.
 * These keys allow the receiver to generate the private key associated with his stealth address.
 * Users publish their public keys by invoking the appropriate functions in the contract.
 * The contract maintains a log of published keys and keeps track of the total funds sent and received.
 * Users can transfer native coins, ERC20, and Non-fungible tokens to a designated recipient stealth address,
 * authorized by their published keys.
 */

contract Logs {
    using SafeMath for uint256;

    // @notice Define a struct to represent public keys
    // @dev 'x_cor' and 'y_cor' are the 32 bytes represent ephemeral key
    // where sharedSecret is 2 bytes of stealth address prefixed with ephemeral key , used for verification
    // public keys = sharedSecret + (x_cor + y_cor) sharedSecret + (ephemeral keys)

    struct publickeys {
        bytes32 x_cor;
        bytes32 y_cor;
        bytes2 sharedSecret;
    }

    // @notice Define variables to keep track of the total funds received and the length of public keys

    uint256 internal totalFunds;

    uint256 internal totalStealthAdd;

    // @notice Define a variable to store the owner of the contract

    address private owner;

    // @notice Define an array to store the logs of published public keys

    publickeys[] public logs;

    // @notice Define the contract name

    string public contractName;

    // @notice Events

    event publicKeys(bytes32 x_cor, bytes32 y_cor, bytes2 sharedSecret);

    // @notice Modifiers

    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }

    modifier validateTokenAddr(address token) {
        require(token != address(0x0), "Token address required");
        _;
    }

    // @notice Constructor

    constructor() {
        owner = msg.sender;
        contractName = "Forus v1";
    }

    // @notice Getters

    function gettotalStealthAddresses() public view returns (uint256) {
        return totalStealthAdd;
    }

    function getTotalVolume() public view returns (uint256) {
        return totalFunds;
    }

    // @notice Function to update the total volume of the contract

    function updateTvl(uint256 _vol) internal {
        uint256 updatedTotalFunds;
        uint256 updatedtotalStealthAddresses;

        assembly {
            // Load values from storage
            updatedTotalFunds := sload(totalFunds.slot)
            updatedtotalStealthAddresses := sload(totalStealthAdd.slot)

            // Perform operations
            updatedTotalFunds := add(updatedTotalFunds, _vol)
            updatedtotalStealthAddresses := add(updatedtotalStealthAddresses, 1)

            // Store the updated values back to storage
            sstore(totalFunds.slot, updatedTotalFunds)
            sstore(totalStealthAdd.slot, updatedtotalStealthAddresses)
        }
    }

    // @notice Function to publish public keys
    // @param x_cor & y_cor: 32-byte of ephemeral key
    // @param sharedSecret: 2-bytes of stealth address prefixed with ephemeral key

    function publishPubkeys(
        bytes32 x_cor,
        bytes32 y_cor,
        bytes2 sharedSecret
    ) private {
        logs.push(publickeys(x_cor, y_cor, sharedSecret));
    }

    // @notice Function to get the length of public keys array

    function pubKeysLen() public view returns (uint256) {
        return logs.length;
    }

    // @notice Function to transfer eth to a target stealth address
    // @param x_cor & y_cor: 32-byte ephemeral key

    // @param sharedSecret: 2-byte of stealth address prefixed with ephemeral key
    // @param target: The target address (i.e., the recipient's stealth address)

    function Transfer(
        bytes32 x_cor,
        bytes32 y_cor,
        bytes2 sharedSecret,
        address payable target
    ) public payable returns (uint256) {
        // Check that the value being transferred is greater than 0.
        require(msg.value > 0, "Amount should be more than 0");

        // Publishing public keys on chain respective to receipent's key

        publishPubkeys(x_cor, y_cor, sharedSecret);

        // @notice Transfer the funds to the targeted stealth address

        (bool transferSuccess, ) = target.call{value: msg.value}("");

        require(transferSuccess, "Transfer to recipient failed");

        // Perform calculations and updates using temporary variables

        updateTvl(msg.value);

        // Emit an event to log the publication of public keys

        emit publicKeys(x_cor, y_cor, sharedSecret);

        return (msg.value);
    }

    // @notice Function to transfer ERC20 tokens to a target stealth address
    // @param x_cor & y_cor: 32-byte ephemeral key

    // @param sharedSecret: 2-byte of stealth address prefixed with ephemeral key
    // @param token: The ERC20 token contract address
    // @param target: The target address (i.e., the recipient's stealth address)
    // @param amount: The amount of tokens to transfer

    function TransferERC20(
        bytes32 x_cor,
        bytes32 y_cor,
        bytes2 sharedSecret,
        address token,
        address target,
        uint256 amount
    ) external payable validateTokenAddr(token) {
        
        // Check that the amount being transferred is greater than 0

        require(amount > 0, "Amount should be more than 0");

        require(
            IERC20(token).balanceOf(msg.sender) >= amount,
            "Not enough tokens"
        );

        if (IERC20(token).allowance(msg.sender, address(this)) < amount) {
            revert("Not enough allowance");
        }

        // Publish the public keys.
        publishPubkeys(x_cor, y_cor, sharedSecret);

        // @notice Transfer tokens from sender's account to target account.
        IERC20(token).transferFrom(msg.sender, target, amount);

        // Perform calculations and updates using temporary variables.
        updateTvl(amount);

        // Emit an event to log the publication of public keys.
        emit publicKeys(x_cor, y_cor, sharedSecret);
    }

    // @notice Function to transfer ERC721 token  to a target stealth address
    // @param x_cor & y_cor: 32-byte ephemeral key

    // @param sharedSecret: 2-byte of stealth address prefixed with ephemeral key
    // @param ERC721Token: The ERC721 token address
    // @param target: The targeted stealth address
    // @param tokenId: The tokenId of ERC721 to transfer

    function TransferERC721(
        bytes32 x_cor,
        bytes32 y_cor,
        bytes2 sharedSecret,
        address ERC721Token,
        address target,
        uint256 tokenId
    ) external {
        // Check that ERC721Token is not empty.

        require(ERC721Token != address(0x0), " Enter the token address");

        require(
            IERC721(ERC721Token).ownerOf(tokenId) == msg.sender,
            "You are not the owner of this tokenId"
        );

        // check if the ERC721 approval belongs to the owner

        if (IERC721(ERC721Token).getApproved(tokenId) != address(this)) {
            revert("Not approved");
        }

        // Publish the public keys.
        publishPubkeys(x_cor, y_cor, sharedSecret);

        // @notice Transfer Non Fungible tokens (ERC721) from sender's account to target account.

        IERC721(ERC721Token).transferFrom(msg.sender, target, tokenId);

        // Perform calculations and updates using temporary variables.
        updateTvl(1);

        // Emit an event to log the publication of public keys.
        emit publicKeys(x_cor, y_cor, sharedSecret);
    }




    // @notice Function to retrieve a range of public keys
    // @param initVal: The initial value required to start retreiving public keys 
     

    function retrievePubKeys(uint256 initVal)
        public
        view
        returns (publickeys[10] memory)
    {
        publickeys[10] memory Keys;

        // Ensure initVal is not greater than the length of logs
        uint256 j = initVal >= logs.length ? logs.length : initVal;
        uint256 end = j > 10 ? j - 10 : 0;

        for (uint256 i = j; i > end; i--) {
            // Check if index is within bounds of the logs array

            //10-10=0 , 10-9=1 decrementing i from j and storing in keys
            Keys[j - i] = logs[i - 1];
        }

        return Keys;
    }
}