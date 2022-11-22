pragma solidity >=0.8.7;

interface IERC20Faucet {
    /**
     * @dev Proxy function to mint Testnet tokens to msg.sender
     * @param _token The address of the token
     * @param _amount The amount to mint
     * @return The amount minted
     **/
    function mint(address _token, uint256 _amount) external returns (uint256);
}
