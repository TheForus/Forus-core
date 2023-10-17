// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

// Import the interfaces for IERC20 and IERC721 tokens
import "./IERC20.sol";
import "./IERC721.sol";
import "./SafeMath.sol";
import "./Lib.sol";

/**
 * @title Logs
 * @dev The Logs contract allows users to publish their public keys on  blockchain,
 * consisting of the parameters r, s, and v.
 * These keys allow the receiver to generate the private key associated with his stealth address.
 * Users publish their public keys by invoking the appropriate functions in the contract.
 * The contract maintains a log of published keys and keeps track of the total funds sent and received.
 * Users can transfer ethereum, IERC20, and Non-fungible tokens to a designated recipient stealth address,
 * authorized by their published keys.
 */

contract Logs {
    using SafeMath for uint256;

    // using Lib for uint256;

    // @notice Define a struct to represent public keys
    // @dev 'r' and 's' are the 32 bytes represent ephemeral key
    // where 'v' is 2 bytes shared secret key prefixed with ephemeral key used for verification
    // public keys = v+(r+s) or v + (ephemeral keys)

    struct publickeys {
        bytes32 r;
        bytes32 s;
        bytes2 v;
    }

    // @notice Define variables to keep track of the total funds received and the length of public keys

    uint256 internal totalFunds;

    uint256 internal totalStealthAdd;

    // @notice Define a variable to store the owner of the contract

    address private owner;

    // @notice Define an array to store the logs of published public keys

    publickeys[] public keys;

    mapping(string => publickeys[]) public logs;

    // @notice Define the contract name

    string public contractName;

    // @notice Events

    event publicKeys(bytes32 r, bytes32 s, bytes2 v);

    // @notice Modifiers

    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }

    modifier validateTokenAddr(address token) {
        require(token != address(0x0), "Token address required");
        _;
    }

    // @notice Constructor

    constructor() {
        owner = msg.sender;
        contractName = "Forus v1";
    }

    // @notice Getters

    function gettotalStealthAddresses() public view returns (uint256) {
        return totalStealthAdd;
    }

    function getTotalVolume() public view returns (uint256) {
        return totalFunds;
    }

    // @notice Function to update the total volume of the contract

    function updateTvl(uint256 _vol) internal {
        uint256 updatedTotalFunds;
        uint256 updatedtotalStealthAddresses;

        assembly {
            // Load values from storage
            updatedTotalFunds := sload(totalFunds.slot)
            updatedtotalStealthAddresses := sload(totalStealthAdd.slot)

            // Perform operations
            updatedTotalFunds := add(updatedTotalFunds, _vol)
            updatedtotalStealthAddresses := add(updatedtotalStealthAddresses, 1)

            // Store the updated values back to storage
            sstore(totalFunds.slot, updatedTotalFunds)
            sstore(totalStealthAdd.slot, updatedtotalStealthAddresses)
        }
    }

    receive() external payable {}

    // @notice Function to withdraw the balance of the contract
    // @param _dest: The destination address

    function withdraw(address _dest) public onlyOwner {
        uint256 contractBalance = address(this).balance;
        (bool sent, ) = _dest.call{value: contractBalance}("");
        require(sent, "Failed to send eth");
    }

    function getBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    // @notice Function to publish public keys
    // @param r s: 32-byte of ephemeral key
    // @param v: 2-byte shared secret key prefixed with ephemeral key

    function publishPubkeys(
        string memory key,
        bytes32 r,
        bytes32 s,
        bytes2 v
    ) private {
        logs[key].push(publickeys(r, s, v));
        keys.push(publickeys(r, s, v));
    }

    // @notice Function to get the length of public keys array

    function pubKeysLen() public view returns (uint256) {
        return keys.length;
    }

    // @notice Function to transfer eth to a target stealth address
    // @param r & s: 32-byte ephemeral key

    // @param v: 2-byte shared secret key prefixed with ephemeral key
    // @param target: The target address (i.e., the recipient's stealth address)

    function Transfer(
        string memory key,
        bytes32 r,
        bytes32 s,
        bytes2 v,
        address payable target
    )
        public
        payable
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        // Check that the value being transferred is greater than 0.
        require(msg.value > 0, "Amount should be more than 0");

        uint256 amountEth = msg.value;

        // Calculate and transfer the required 0.1% fee
        uint256 initFee = (msg.value.mul(1)) / 1000;
        require(initFee > 0,'Not enough fees');

        if (msg.sender.balance < msg.value.add(initFee)) {
            revert("Not enough eth to cover transaction");
        }

        // Publishing public keys on chain respective to receipent's key
        publishPubkeys(key, r, s, v);


         // @notice Store the 0.1 % eth to the contract
        (bool store, ) = address(this).call{value: initFee}("");
        require(store, "Failed to send");


        // @notice Transfer the funds to the targeted stealth address
        (bool transferSuccess, ) = target.call{value: msg.value.sub(initFee)}("");
        require(transferSuccess, "Transfer to recipient failed");

       
        // Perform calculations and updates using temporary variables
        updateTvl(msg.value);

        // Emit an event to log the publication of public keys

        emit publicKeys(r, s, v);

        return (amountEth, initFee, msg.sender.balance, address(this).balance);
    }

    // @notice Function to transfer IERC20 tokens to a target stealth address
    // @param r & s: 32-byte ephemeral key
    // @param v: 2-byte shared secret key prefixed with ephemeral key
    // @param token: The IERC20 token address
    // @param target: The target address
    // @param amount: The amount of tokens to transfer

    function TransferERC20(
        string memory key,
        bytes32 r,
        bytes32 s,
        bytes2 v,
        address token,
        address target,
        uint256 amount
    ) external payable validateTokenAddr(token) {
        uint256 amountEth = msg.value;

        // Check that the amount being transferred is greater than 0

        require(amountEth > 0, "Amount should be more than 0");

        require(
            IERC20(token).balanceOf(msg.sender) >= amountEth,
            "Not enough tokens"
        );

        if (IERC20(token).allowance(msg.sender, address(this)) < amountEth) {
            revert("Not enough allowance");
        }

        // Calculate and transfer the required 0.1% fee
        uint256 initFee = (msg.value.mul(1)) / 1000;
        require(initFee > 0,'Not enough fees');
        

        if (amount < initFee && msg.sender.balance < initFee) {
            revert("Not enough eth to cover Lib");
        }

        // @notice Store the 0.1 % eth to the contract
        (bool store, ) = address(this).call{value: initFee}("");
        require(store, "Failed to send");

        // Publish the public keys.
        publishPubkeys(key, r, s, v);

        // @notice Transfer tokens from sender's account to target account.
        IERC20(token).transferFrom(msg.sender, target, amount);

        // Perform calculations and updates using temporary variables.
        updateTvl(amount);

        // Emit an event to log the publication of public keys.
        emit publicKeys(r, s, v);
    }

    // @notice Function to transfer IERC721/ERC721  to a target stealth address
    // @param r & s: 32-byte ephemeral key
    // @param v: 2-byte shared secret key prefixed with ephemeral key
    // @param ERC721Token: The IERC721 token address
    // @param target: The targeted stealth address
    // @param tokenId: The tokenId of IERC721 to transfer

    function TransferERC721(
        string memory key,
        bytes32 r,
        bytes32 s,
        bytes2 v,
        address ERC721Token,
        address target,
        uint256 tokenId
    ) external {
        // Check that ERC721Token is not empty.
        require(ERC721Token != address(0x0), " Enter the token address");

        require(
            IERC721(ERC721Token).ownerOf(tokenId) == msg.sender,
            "You are not the owner of this tokenId"
        );

        // check if the ERC721 approval belongs to the owner

        if (IERC721(ERC721Token).getApproved(tokenId) != address(this)) {
            revert("Not approved");
        }

        // Publish the public keys.
        publishPubkeys(key, r, s, v);

        // @notice Transfer Non Fungible tokens (ERC721) from sender's account to target account.

        IERC721(ERC721Token).transferFrom(msg.sender, target, tokenId);

        // Perform calculations and updates using temporary variables.
        updateTvl(1);

        // Emit an event to log the publication of public keys.
        emit publicKeys(r, s, v);
    }

    // @notice Function to retrieve a range of public keys
    // @param initVal: The initial value required retreiving public keys

    function retrievePubKeys(string memory key, uint256 initVal)
        public
        view
        returns (publickeys[10] memory)
    {
        publickeys[10] memory Keys;

        uint256 len = logs[key].length;
        uint256 end = initVal.add(10);
        uint256 finalVal = Lib.min(len, end);

        for (uint256 i = initVal; i < finalVal; i++) {
            Keys[i - initVal] = logs[key][i];
        }

        return Keys;
    }
}
