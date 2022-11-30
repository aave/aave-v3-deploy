pragma solidity >=0.8.7;

import {IFaucet} from "./interfaces/IFaucet.sol";
import {FaucetMintableERC20} from "./FaucetMintableERC20.sol";
import {Ownable} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/Ownable.sol";

/**
 * @title ERC20FaucetOwnable
 * @dev Ownable Faucet Contract
 */
contract ERC20FaucetOwnable is IFaucet, Ownable {
    // oner of erc20 is faucet

    constructor(
        address owner // change to owner and also transfer ownership
    ) {
        require(owner != address(0));
        transferOwnership(owner);
    }

    /// @inheritdoc IFaucet
    function mint(
        address _token,
        address _destinationAddress,
        uint256 _amount
    ) external override onlyOwner returns (uint256) {
        // call internal function _mint()
        // the faucet will call to this interface
        // _mint(_defender, _amount);
        // currently we do not know who is the receipient of the token.
        FaucetMintableERC20(_token).mint(_destinationAddress, _amount);
        return _amount;
    }
}
