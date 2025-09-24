// Test MetaMask network connection to Sepolia
export const testMetaMaskConnection = async () => {
  if (!window.ethereum) {
    return {
      success: false,
      error: "MetaMask not installed"
    };
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Get current network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    // Check if connected to Sepolia (Chain ID: 0xaa36a7 = 11155111 in hex)
    const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';
    if (chainId === SEPOLIA_CHAIN_ID_HEX) {
      return {
        success: true,
        account: accounts[0],
        chainId: chainId,
        network: "Sepolia"
      };
    } else {
      return {
        success: false,
        error: `Wrong network. Expected: ${SEPOLIA_CHAIN_ID_HEX} (Sepolia), Got: ${chainId}`,
        currentChainId: chainId,
        account: accounts[0]
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Switch to Sepolia network
export const switchToSepolia = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
    });
    return { success: true };
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia',
            nativeCurrency: {
              name: 'SepoliaETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: [process.env.REACT_APP_RPC_URL || 'https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }],
        });
        return { success: true };
      } catch (addError) {
        throw new Error(`Failed to add network: ${addError.message}`);
      }
    }
    throw new Error(`Failed to switch network: ${switchError.message}`);
  }
};
