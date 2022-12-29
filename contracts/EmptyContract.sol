// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

/** @dev Unused empty contract to prevent Hardhat + hardhat-dependency-compiler bug at Typechain generation time. */
contract EmptyContract  {
    function get() external view returns (uint256) {
        return 0;
    }
}