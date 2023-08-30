// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address token, address sender) external view returns (uint256 remaining);
    function approve(address sender, uint256 amount) external returns (bool success);
}
