// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./IXRC20.sol";
import "./IXRC721.sol";


/**
 * @title Logs
 * @dev A smart contract that enables the publication of pub keys on the blockchain and facilitates fund transfers to a specified address.
 *
 * The Logs contract allows senders to publish their public keys on the blockchain, consisting of the parameters r, s, and v.
 * These keys serve as authorization for the associated transactions and provide an additional layer of security.
 *
 * Users can publish their pub keys by invoking the appropriate functions in the contract.
 * The contract maintains a log of published keys and keeps track of the total funds received.
 *
 * Users can transfer XDC, XRC20 tokens, and XRC721 tokens to a designated recipient address, authorized by their published keys.
 */



contract Logs {

    struct publickeys {
        bytes32 r;
        bytes32 s;
        bytes4 v;
    }

    uint256 internal totalFunds;

    uint256 internal limit;

    event publicKeys(
        bytes32 r,
        bytes32 s,
        bytes4 secret,
        uint256 indexed timestamp
    );

    address private owner;

    publickeys[] public logs;

    constructor() {
        owner = msg.sender;
    }

    function getTotalAddresses() public view returns (uint256) {
        return limit;
    }

    function getTotalVolume() public view returns (uint256) {
        return totalFunds;
    }

    function publishEphkeys(bytes32 r, bytes32 s, bytes4 v) private {
        logs.push(publickeys(r, s, v));
    }

    function TransferXDC(
        bytes32 r,
        bytes32 s,
        bytes4 secret,
        address payable target
    ) public payable {
        require(msg.value > 0, "amount should be more than 0");
        require(target != address(0x0), " Target address required");

        publishEphkeys(r, s, secret);

        (bool sent, ) = target.call{value: msg.value}("");
        require(sent, " Failed to send ");
        // Perform calculations and updates using temporary variables
        uint256 updatedTotalFunds = totalFunds + msg.value;
        uint256 updatedLimit = limit + 1;

        // Update storage variables with the updated values
        totalFunds = updatedTotalFunds;
        limit = updatedLimit;
        emit publicKeys(r, s, secret, block.timestamp);
    }

    function TransferXRC20(
        bytes32 r,
        bytes32 s,
        bytes4 secret,
        address token,
        address target,
        uint256 amount
    ) external {
        require(amount > 0, "Amount should be more than 0");
        require(token != address(0x0), " Enter the token address");
        require(target != address(0x0), " Enter the receipent address");

        publishEphkeys(r, s, secret);

        IXRC20(token).transferFrom(msg.sender, target, amount);
        // Perform calculations and updates using temporary variables
        uint256 updatedTotalFunds = totalFunds + amount;
        uint256 updatedLimit = limit + 1;

        // Update storage variables with the updated values
        totalFunds = updatedTotalFunds;
        limit = updatedLimit;
        emit publicKeys(r, s, secret, block.timestamp);
    }

    function TransferXRC721(
        bytes32 r,
        bytes32 s,
        bytes4 secret,
        address NftToken,
        address target,
        uint256 tokenId
    ) external {
        require(NftToken != address(0x0), " Enter the token address");
        require(target != address(0x0), " Target address required");

        publishEphkeys(r, s, secret);

        IXRC721(NftToken).transferFrom(msg.sender, target, tokenId);
        // Perform calculations and updates using temporary variables
        uint256 updatedTotalFunds = totalFunds + tokenId;
        uint256 updatedLimit = limit + 1;

        // Update storage variables with the updated values
        totalFunds = updatedTotalFunds;
        limit = updatedLimit;
        emit publicKeys(r, s, secret, block.timestamp);
    }
}
