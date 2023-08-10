// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IXRC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
