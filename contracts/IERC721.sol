// SPDX-License-Identifier: MIT

// This is an interface for the ERC721 token standard.
// ERC721 is a standard for non-fungible tokens (NFTs) on the Ethereum blockchain.

pragma solidity ^0.8.24;

interface IERC721 {
    // Transfers ownership of an NFT from one address to another.
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    // Returns the owner of a specific NFT.
    function ownerOf(uint256 tokenId) external view returns (address);

    // Returns the approved address for a specific NFT.
    function getApproved(uint256 _tokenId) external view returns (address);

    // Approves another address to transfer the given NFT.
    function approve(address sender, uint256 _tokenId)
        external
        returns (bool success);
}