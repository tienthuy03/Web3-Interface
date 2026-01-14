import { useState, useEffect } from "react"
import { useWeb3ModalProvider } from "@web3modal/ethers/react"
import { BrowserProvider, Contract } from "ethers"
import { ABI, CONTRACT_ADDRESS } from "../contracts/contractData"
import { getAllBrands, addBrand, updateBrand } from "../contracts"
import type { Brand } from "../types/brand"

export const useBrands = () => {
  const { walletProvider } = useWeb3ModalProvider()

  const [brands, setBrands] = useState<Brand[]>([])
  const [loadingBrands, setLoadingBrands] = useState(false)

  /**
   * Fetch brands
   */
  const fetchBrands = async () => {
    if (!walletProvider) return

    try {
      setLoadingBrands(true)
      const provider = new BrowserProvider(walletProvider)
      const data = await getAllBrands(provider)
      setBrands(data)
    } catch (err) {
      console.error("❌ fetchBrands error:", err)
    } finally {
      setLoadingBrands(false)
    }
  }

  /**
   * Change brand active status
   */
  const changeBrandStatus = async (id: number, active: boolean) => {
    if (!walletProvider) return

    try {
      const provider = new BrowserProvider(walletProvider)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer)

      const tx = await contract.setBrandStatus(id, active)
      await tx.wait()

      setBrands(prev =>
          prev.map(b => (b.id === id ? { ...b, active } : b))
      )
    } catch (err) {
      console.error("❌ changeBrandStatus error:", err)
      throw err
    }
  }

  /**
   * Create brand
   */
  const createBrand = async (name: string) => {
    if (!walletProvider) return

    try {
      const provider = new BrowserProvider(walletProvider)
      return await addBrand(provider, name)
    } catch (err) {
      console.error("❌ createBrand error:", err)
      throw err
    }
  }

  /**
   * Update brand name
   */
  const updateBrandName = async (id: number, name: string) => {
    if (!walletProvider) return

    try {
      const provider = new BrowserProvider(walletProvider)
      return await updateBrand(provider, id, name)
    } catch (err) {
      console.error("❌ updateBrand error:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [walletProvider])

  return {
    brands,
    loadingBrands,
    fetchBrands,
    changeBrandStatus,
    createBrand,
    updateBrandName,
  }
}
