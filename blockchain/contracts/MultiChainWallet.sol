// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MultiChainWallet
 * @dev A wallet contract that supports multiple chains and token swaps
 */
contract MultiChainWallet is ReentrancyGuard, Ownable {
    constructor() Ownable(msg.sender) {}
    using SafeERC20 for IERC20;

    // Struct to represent a token balance
    struct TokenBalance {
        address tokenAddress;
        uint256 balance;
    }

    // Mapping of chain ID to user address to token balances
    mapping(uint256 => mapping(address => TokenBalance[])) private _balances;

    // Events
    event Deposit(uint256 indexed chainId, address indexed user, address indexed token, uint256 amount);
    event Withdrawal(uint256 indexed chainId, address indexed user, address indexed token, uint256 amount);
    event TokenSwap(uint256 indexed chainId, address indexed user, address indexed fromToken, address toToken, uint256 fromAmount, uint256 toAmount);

    /**
     * @dev Deposits tokens into the wallet
     * @param chainId The ID of the chain where the deposit is made
     * @param token The address of the token being deposited
     * @param amount The amount of tokens to deposit
     */
    function deposit(uint256 chainId, address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Deposit amount must be greater than 0");
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        TokenBalance[] storage userBalances = _balances[chainId][msg.sender];
        bool found = false;
        
        for (uint i = 0; i < userBalances.length; i++) {
            if (userBalances[i].tokenAddress == token) {
                userBalances[i].balance += amount;
                found = true;
                break;
            }
        }
        
        if (!found) {
            userBalances.push(TokenBalance(token, amount));
        }
        
        emit Deposit(chainId, msg.sender, token, amount);
    }

    /**
     * @dev Withdraws tokens from the wallet
     * @param chainId The ID of the chain where the withdrawal is made
     * @param token The address of the token being withdrawn
     * @param amount The amount of tokens to withdraw
     */
    function withdraw(uint256 chainId, address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        
        TokenBalance[] storage userBalances = _balances[chainId][msg.sender];
        bool found = false;
        
        for (uint i = 0; i < userBalances.length; i++) {
            if (userBalances[i].tokenAddress == token) {
                require(userBalances[i].balance >= amount, "Insufficient balance");
                userBalances[i].balance -= amount;
                found = true;
                
                if (userBalances[i].balance == 0) {
                    // Remove the token from the array if balance becomes zero
                    userBalances[i] = userBalances[userBalances.length - 1];
                    userBalances.pop();
                }
                
                break;
            }
        }
        
        require(found, "Token not found in user's balance");
        
        IERC20(token).safeTransfer(msg.sender, amount);
        
        emit Withdrawal(chainId, msg.sender, token, amount);
    }

    /**
     * @dev Swaps tokens within the same chain
     * @param chainId The ID of the chain where the swap is performed
     * @param fromToken The address of the token to swap from
     * @param toToken The address of the token to swap to
     * @param fromAmount The amount of tokens to swap
     * @param minToAmount The minimum amount of tokens to receive
     */
    function swapTokens(uint256 chainId, address fromToken, address toToken, uint256 fromAmount, uint256 minToAmount) external nonReentrant {
        require(fromAmount > 0, "Swap amount must be greater than 0");
        require(fromToken != toToken, "Cannot swap to the same token");
        
        TokenBalance[] storage userBalances = _balances[chainId][msg.sender];
        bool fromFound = false;
        bool toFound = false;
        uint256 fromIndex;
        uint256 toIndex;
        
        for (uint i = 0; i < userBalances.length; i++) {
            if (userBalances[i].tokenAddress == fromToken) {
                require(userBalances[i].balance >= fromAmount, "Insufficient balance");
                fromFound = true;
                fromIndex = i;
            }
            if (userBalances[i].tokenAddress == toToken) {
                toFound = true;
                toIndex = i;
            }
            if (fromFound && toFound) break;
        }
        
        require(fromFound, "From token not found in user's balance");
        
        // Perform the swap (in a real implementation, this would interact with a DEX or liquidity pool)
        uint256 toAmount = performSwap(fromToken, toToken, fromAmount);
        require(toAmount >= minToAmount, "Slippage too high");
        
        // Update balances
        userBalances[fromIndex].balance -= fromAmount;
        if (userBalances[fromIndex].balance == 0) {
            userBalances[fromIndex] = userBalances[userBalances.length - 1];
            userBalances.pop();
        }
        
        if (toFound) {
            userBalances[toIndex].balance += toAmount;
        } else {
            userBalances.push(TokenBalance(toToken, toAmount));
        }
        
        emit TokenSwap(chainId, msg.sender, fromToken, toToken, fromAmount, toAmount);
    }

    /**
     * @dev Returns the balance of a specific token for a user on a specific chain
     * @param chainId The ID of the chain
     * @param user The address of the user
     * @param token The address of the token
     * @return The balance of the token
     */
    function getTokenBalance(uint256 chainId, address user, address token) external view returns (uint256) {
        TokenBalance[] storage userBalances = _balances[chainId][user];
        
        for (uint i = 0; i < userBalances.length; i++) {
            if (userBalances[i].tokenAddress == token) {
                return userBalances[i].balance;
            }
        }
        
        return 0;
    }

    /**
     * @dev Returns all token balances for a user on a specific chain
     * @param chainId The ID of the chain
     * @param user The address of the user
     * @return An array of TokenBalance structs
     */
    function getAllTokenBalances(uint256 chainId, address user) external view returns (TokenBalance[] memory) {
        return _balances[chainId][user];
    }

    /**
     * @dev Performs the actual token swap (placeholder for DEX integration)
     * @param fromToken The address of the token to swap from
     * @param toToken The address of the token to swap to
     * @param fromAmount The amount of tokens to swap
     * @return The amount of tokens received
     */
    function performSwap(address fromToken, address toToken, uint256 fromAmount) internal pure returns (uint256) {
        // In a real implementation, this function would interact with a DEX or liquidity pool
        // For this example, we'll use a simple 1:1 ratio
        return fromAmount;
    }

    /**
     * @dev Allows the contract owner to recover any ERC20 tokens sent to the contract by mistake
     * @param token The address of the token to recover
     * @param amount The amount of tokens to recover
     */
    function recoverERC20(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}