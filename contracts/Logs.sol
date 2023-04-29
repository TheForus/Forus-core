// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract Logs {
    using SafeERC20 for IERC20;

    struct publickeys {
        bytes32 r;
        bytes32 s;
        bytes1 ss;
    }

    uint256 internal limit;

    event ephemeralKeys(
        bytes32 r,
        bytes32 s,
        bytes1 secret,
        uint256 indexed timestamp
    );

    address private owner;

    publickeys[] public logs;

    constructor() {
        owner = msg.sender;
    }

    function getLimit() public view returns (uint256) {
        return limit;
    }

    function publishEphkeys(bytes32 r, bytes32 s, bytes1 secret) private {
        logs.push(publickeys(r, s, secret));
    }

    function TransferCoin(
        bytes32 r,
        bytes32 s,
        bytes1 secret,
        address payable target
    ) public payable {
        require(msg.value > 0, "Sending amount should be more than 0");
        require(target != address(0x0), " Target address required");

        publishEphkeys(r, s, secret);

        (bool sent, ) = target.call{value: msg.value}("");
        require(sent, " Failed to send ");
        limit++;
        emit ephemeralKeys(r, s, secret, block.timestamp);
    }

    function TransferToken(
        bytes32 r,
        bytes32 s,
        bytes1 secret,
        address token,
        address target,
        uint256 amount
    ) external {
        require(amount > 0, "Sending amount should be more than 0");
        require(token != address(0x0), " Token contract required");
        require(target != address(0x0), " Target address required");

        publishEphkeys(r, s, secret);

        IERC20(token).safeTransferFrom(msg.sender, target, amount);
        limit++;
        emit ephemeralKeys(r, s, secret, block.timestamp);
    }

    function TransferNft(
        bytes32 r,
        bytes32 s,
        bytes1 secret,
        address Nft,
        address target,
        uint256 tokenId
    ) external {
        require(Nft != address(0x0), " Token contract required");
        require(target != address(0x0), " Target address required");

        publishEphkeys(r, s, secret);

        IERC721(Nft).safeTransferFrom(msg.sender, target, tokenId);
        limit++;
        emit ephemeralKeys(r, s, secret, block.timestamp);
    }
}
