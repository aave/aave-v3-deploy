// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.10;

import {WETH9} from "@aave/core-v3/contracts/dependencies/weth/WETH9.sol";

contract NativeWrapperMock is WETH9 {
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    // Mint not backed by Ether: only for testing purposes
    function mint(uint256 value) public returns (bool) {
        balanceOf[msg.sender] += value;
        emit Transfer(address(0), msg.sender, value);
        return true;
    }

    function mint(address account, uint256 value) public returns (bool) {
        balanceOf[account] += value;
        emit Transfer(address(0), account, value);
        return true;
    }
}
