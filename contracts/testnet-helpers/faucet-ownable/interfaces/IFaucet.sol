pragma solidity >=0.8.7;

interface IFaucet {
    /**
     * @dev Proxy function to mint Testnet tokens to msg.sender
     * @param _token The address of the token
     * @param _destinationAddress The amount to mint
     * @param _amount The amount to mint
     * @return The amount minted
     **/
    function mint(
        address _token,
        address _destinationAddress,
        uint256 _amount
    ) external returns (uint256);
}
