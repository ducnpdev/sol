import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import WalletConnect from './components/WalletConnect';
import { VotingContractABI } from './contracts/VotingContractABI';
import { testMetaMaskConnection, switchToHardhatNetwork } from './utils/networkTest';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contractLoading, setContractLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('polls');
  const [networkStatus, setNetworkStatus] = useState(null);

  useEffect(() => {
    if (account && window.ethereum) {
      initializeContract();
    }
  }, [account]);

  const initializeContract = async () => {
    setContractLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const votingContract = new ethers.Contract(CONTRACT_ADDRESS, VotingContractABI, signer);
      
      // Test the connection with timeout
      try {
        const ownerPromise = votingContract.owner();
        console.log("ownerPromise", ownerPromise);
        console.log("votingContract", votingContract);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 5000)
        );
        await Promise.race([ownerPromise, timeoutPromise]);
      } catch (error) {
        console.error("Contract connection failed:", error);
        alert("Failed to connect to contract. Please make sure you're connected to the Hardhat Local network (Chain ID: 1337)");
        setContractLoading(false);
        return;
      }
      
      setContract(votingContract);
      
      // Check if current user is owner
      const owner = await votingContract.owner();
      setIsOwner(owner.toLowerCase() === account.toLowerCase());
    } catch (error) {
      console.error('Error initializing contract:', error);
      alert('Error connecting to contract: ' + error.message);
    } finally {
      setContractLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setIsOwner(false);
    setNetworkStatus(null);
  };

  const testNetwork = async () => {
    try {
      const result = await testMetaMaskConnection();
      setNetworkStatus(result);
      if (!result.success) {
        alert(`Network Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Network test failed:', error);
      alert('Network test failed: ' + error.message);
    }
  };

  const switchNetwork = async () => {
    try {
      await switchToHardhatNetwork();
      alert('Successfully switched to Hardhat Local network! Please refresh the page.');
      window.location.reload();
    } catch (error) {
      console.error('Network switch failed:', error);
      alert('Failed to switch network: ' + error.message);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <WalletConnect onConnect={connectWallet} loading={loading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Decentralized Voting</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              {isOwner && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Owner
                </span>
              )}
              <button
                onClick={testNetwork}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Test Network
              </button>
              <button
                onClick={switchNetwork}
                className="inline-flex items-center px-3 py-1 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Switch to Hardhat
              </button>
              <button
                onClick={disconnectWallet}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Network Status */}
      {networkStatus && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`p-3 rounded-md ${
            networkStatus.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex">
              <div className={`flex-shrink-0 ${
                networkStatus.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {networkStatus.success ? '✅' : '❌'}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  networkStatus.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {networkStatus.success ? 'Connected to Hardhat Local' : 'Network Error'}
                </p>
                {!networkStatus.success && (
                  <p className="text-sm text-red-700 mt-1">
                    {networkStatus.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('polls')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'polls'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Polls
            </button>
            {isOwner && (
              <button
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create Poll
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {contractLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Connecting to contract...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'polls' && (
              <PollList contract={contract} account={account} isOwner={isOwner} />
            )}
            {activeTab === 'create' && isOwner && (
              <CreatePoll contract={contract} onPollCreated={() => setActiveTab('polls')} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
