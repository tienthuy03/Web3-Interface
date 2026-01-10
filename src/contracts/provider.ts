import { ethers } from "ethers"

export async function getProvider() {
    if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
            return new ethers.BrowserProvider((window as any).ethereum)
        } catch (e) {
            console.log("Wallet provider failed, using RPC:", e)
        }
    }

    const rpcUrl = import.meta.env.VITE_ETH_SEPOLIA_RPC_URL

    if (rpcUrl) {
        try {
            return new ethers.JsonRpcProvider(rpcUrl)
        } catch (err) {
            console.error("Failed to create RPC provider:", err)
        }
    }

    const publicRpcs = [
        "https://rpc.sepolia.org",
        "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        "https://ethereum-sepolia-rpc.publicnode.com",
    ]

    for (const rpc of publicRpcs) {
        try {
            const provider = new ethers.JsonRpcProvider(rpc)
            await provider.getBlockNumber()
            return provider
        } catch {
            continue
        }
    }

    return ethers.getDefaultProvider("sepolia")
}
