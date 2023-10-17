// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./SafeMath.sol";

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */

library Lib {
    
    using SafeMath for uint256;

    // calculating 0.1 amount from the given input

    function cal(uint req) external pure returns (uint256 amountToTransfer) {
        uint256 amount = (req.mul(1)).div(100);
        amountToTransfer = amount;
    }

    function min(uint256 x, uint256 y) external pure returns (uint256) {
        return x < y ? x : y;
    }
}