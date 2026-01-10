import { useState, useEffect } from "react"
import { useWeb3ModalProvider } from "@web3modal/ethers/react"
import { BrowserProvider, Contract } from "ethers"
import { ABI, CONTRACT_ADDRESS } from "../contracts/contractData"
import { getAllCategories } from "../contracts"
import type { Category } from "../types/category"

export const useCategories = () => {
  const { walletProvider } = useWeb3ModalProvider()

  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  /**
   * Fetch categories
   */
  const fetchCategories = async () => {
    if (!walletProvider) return

    try {
      setLoadingCategories(true)
      const provider = new BrowserProvider(walletProvider)
      const data = await getAllCategories(provider)
      setCategories(data)
    } catch (err) {
      console.error("❌ fetchCategories error:", err)
    } finally {
      setLoadingCategories(false)
    }
  }

  /**
   * Change category active status
   */
  const changeCategoryStatus = async (id: number, active: boolean) => {
    if (!walletProvider) return

    try {
      const provider = new BrowserProvider(walletProvider)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer)

      const tx = await contract.setCategoryStatus(id, active)
      await tx.wait()

      setCategories(prev =>
          prev.map(c => (c.id === id ? { ...c, active } : c))
      )
    } catch (err) {
      console.error("❌ changeCategoryStatus error:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [walletProvider])

  return {
    categories,
    loadingCategories,
    refetchCategories: fetchCategories,
    changeCategoryStatus,
  }
}
