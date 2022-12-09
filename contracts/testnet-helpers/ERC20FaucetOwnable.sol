// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import {IFaucet} from "./IFaucet.sol";
import {FaucetMintableERC20} from "./FaucetMintableERC20.sol";
import {Ownable} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/Ownable.sol";

/**
 * @title ERC20FaucetOwnable
 * @dev Ownable Faucet Contract
 * @dev owner of the faucet is the relayer
 */
contract ERC20FaucetOwnable is IFaucet, Ownable {
    constructor(address owner) {
        require(owner != address(0));
        transferOwnership(owner);
    }

    /// @inheritdoc IFaucet
    function mint(
        address _token,
        address _destinationAddress,
        uint256 _amount
    ) external override onlyOwner returns (uint256) {
        FaucetMintableERC20(_token).mint(_destinationAddress, _amount);
        return _amount;
    }
}
