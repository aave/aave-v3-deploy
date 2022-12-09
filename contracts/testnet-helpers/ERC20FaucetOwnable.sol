// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import {IFaucet} from "./IFaucet.sol";
import {FaucetMintableERC20} from "./FaucetMintableERC20.sol";
import {Ownable} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/Ownable.sol";

/**
 * @title ERC20FaucetOwnable
 * @dev Ownable Faucet Contract
 */
contract ERC20FaucetOwnable is IFaucet, Ownable {
    // If _permissioned is enabled, them only owner can mint Testnet ERC20 tokens
    // If disabled, anyone can call mint at the faucet, for PoC environments
    bool internal _permissioned;

    constructor(address owner, bool permissioned) {
        require(owner != address(0));
        transferOwnership(owner);

        _permissioned = permissioned;
    }

    /**
     * @dev Function modifier, if _permissioned is enabled them msg.sender is required to be the owner
     */
    modifier onlyOwnerIfPermissioned() {
        if (_permissioned == true) {
            require(
                owner() == _msgSender(),
                "Ownable: caller is not the owner"
            );
        }
        _;
    }

    /// @inheritdoc IFaucet
    function mint(
        address token,
        address to,
        uint256 amount
    ) external override onlyOwnerIfPermissioned returns (uint256) {
        FaucetMintableERC20(token).mint(to, amount);
        return amount;
    }

    /// @inheritdoc IFaucet
    function setPermissioned(bool permissioned) external override onlyOwner {
        _permissioned = permissioned;
    }

    /// @inheritdoc IFaucet
    function isPermissioned() external view override returns (bool) {
        return _permissioned;
    }
}
