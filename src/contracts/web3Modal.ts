import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

const projectId = import.meta.env.VITE_WALLETCONNECT_ID

const sepolia = {
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: import.meta.env.VITE_ETH_SEPOLIA_RPC_URL
}

const metadata = {
    name: "Crowdfunding Interface",
    description: "Crowdfunding DApp",
    url: 'https://mywebsite.com',
    icons: ['https://avatars.mywebsite.com/']
}

const ethersConfig = defaultConfig({
    metadata,
    enableInjected: true,
    enableEIP6963: true
})

export const initWeb3Modal = () =>
    createWeb3Modal({
        ethersConfig,
        chains: [sepolia],
        projectId,
        enableAnalytics: true
    })
