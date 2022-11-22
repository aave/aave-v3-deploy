pragma solidity >=0.8.7;

import {IERC20Faucet} from "./IERC20Faucet.sol";
import {ITestnetERC20} from "./ITestnetERC20.sol";

contract ERC20Faucet is IERC20Faucet {
    /// @inheritdoc IERC20Faucet
    function mint(address _token, uint256 _amount)
        external
        override
        returns (uint256)
    {
        ITestnetERC20(_token).mint(msg.sender, _amount);
        return _amount;
    }
}
