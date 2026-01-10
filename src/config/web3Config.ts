import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// 1. Get projectId
const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

// 2. Set chains
const sepolia = {
  chainId: 11155111,
  name: 'Ethereum Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: import.meta.env.VITE_ETH_SEPOLIA_RPC_URL
};

// 3. Create a metadata object
const metadata = {
  name: "Crowdfunding Interface",
  description: "My Website helpe user using Crowdfunding contract",
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
});

// 5. Create a AppKit instance
createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableAnalytics: true
});

export { projectId, sepolia, metadata, ethersConfig };