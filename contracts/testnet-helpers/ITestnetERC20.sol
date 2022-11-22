pragma solidity >=0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITestnetERC20 is IERC20 {
    function mint(address account, uint256 amount) external returns (bool);
}
