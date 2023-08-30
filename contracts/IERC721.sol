// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
   function getApproved(uint256 _tokenId) external view returns (address);
    function approve(address sender, uint256 _tokenId) external returns (bool success);
}