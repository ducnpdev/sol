// Test MetaMask network connection
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
    
    // Check if connected to Hardhat Local (Chain ID: 0x539 = 1337 in hex)
    if (chainId === '0x539') {
      return {
        success: true,
        account: accounts[0],
        chainId: chainId,
        network: "Hardhat Local"
      };
    } else {
      return {
        success: false,
        error: `Wrong network. Expected: 0x539 (Hardhat Local), Got: ${chainId}`,
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

// Switch to Hardhat Local network
export const switchToHardhatNetwork = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x539' }], // 1337 in hex
    });
    return { success: true };
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x539',
            chainName: 'Hardhat Local',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['http://127.0.0.1:8545'],
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
