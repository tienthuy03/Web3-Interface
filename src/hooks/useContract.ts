import { BrowserProvider, Contract } from 'ethers'
import { useWeb3ModalProvider } from '@web3modal/ethers/react'
import { ABI, CONTRACT_ADDRESS } from '../contracts/contractData'

export const useContract = () => {
    const { walletProvider } = useWeb3ModalProvider()

    const getProvider = () => {
        if (!walletProvider) throw new Error('Wallet not connected')
        return new BrowserProvider(walletProvider)
    }

    const getReadContract = async () => {
        const provider = getProvider()
        return new Contract(CONTRACT_ADDRESS, ABI, provider)
    }

    const getWriteContract = async () => {
        const provider = getProvider()
        const signer = await provider.getSigner()
        return new Contract(CONTRACT_ADDRESS, ABI, signer)
    }

    return { getProvider, getReadContract, getWriteContract }
}
