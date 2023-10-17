// SPDX-License-Identifier: MIT

// This is an interface for the ERC20 token standard.
// ERC20 is a widely adopted standard for fungible tokens on the Ethereum blockchain.

pragma solidity ^0.8.16;

interface IERC20 {
    // Transfers a specified amount of tokens from the sender to a recipient.
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    // Returns the balance of tokens for a specific account.
    function balanceOf(address account) external view returns (uint256);

    // Returns the amount of tokens that the spender is allowed to spend on behalf of the owner.
    function allowance(address token, address sender) external view returns (uint256 remaining);

    // Allows the owner of tokens to approve another address to spend a specified amount of tokens on their behalf.
    function approve(address sender, uint256 amount) external returns (bool success);
}
