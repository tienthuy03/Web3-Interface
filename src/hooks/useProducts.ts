import { useState, useEffect } from "react"
import { useWeb3ModalProvider } from "@web3modal/ethers/react"
import { BrowserProvider } from "ethers"
import { getProductsFromChain, getProductFromChain } from "../contracts"
import type { Product } from "../types/product"

export const useProducts = () => {
  const { walletProvider } = useWeb3ModalProvider()

  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  /**
   * Fetch danh sách products
   */
  const fetchProducts = async () => {
    if (!walletProvider) return

    try {
      setLoadingProducts(true)
      const provider = new BrowserProvider(walletProvider)
      const chainProducts = await getProductsFromChain(provider)

      const mapped: Product[] = chainProducts.map((p: any, index: number) => ({
        id: p.id?.toString() ?? index.toString(),
        sku: p.sku ?? "",
        batchNumber: p.batchNumber ?? "",
        name: p.name ?? "",
        price: Number(p.price ?? 0),
        description: p.description ?? "",
        ingredients: p.ingredients ?? "",
        manufactureDate: p.manufactureDate ? Number(p.manufactureDate) : undefined,
        expiryDate: p.expiryDate ? Number(p.expiryDate) : undefined,
        createdAt: p.createdAt ? Number(p.createdAt) : undefined,
        owner: p.owner ?? "",
        status: p.status !== undefined ? Number(p.status) : undefined,
        imageUrl: p.imageUrl ?? "",
        category: p.category ?? "",
        brand: p.brand ?? "",
        currency: p.currency ?? "VND",
        origin: p.origin ?? "",
        documentUrl: p.documentUrl ?? "",
        verifyStatus: p.verifyStatus !== undefined ? Number(p.verifyStatus) : undefined,
      }))

      setProducts(mapped)
    } catch (err) {
      console.error("❌ fetchProducts error:", err)
    } finally {
      setLoadingProducts(false)
    }
  }

  /**
   * Fetch chi tiết product
   */
  const fetchProductDetail = async (productId: string): Promise<Product | null> => {
    try {
      setLoadingDetail(true)
      const id = Number(productId)
      if (isNaN(id)) throw new Error("Product ID không hợp lệ")

      const p = await getProductFromChain(id)
      if (!p) return null

      return {
        ...p,
        id: p.id.toString(),
        imageUrl: p.imageURI ?? "",
        documentUrl: p.documentURI ?? "",
        origin: p.originCountry ?? "",
        name: p.name || p.category || "Sản phẩm không tên",
      }
    } catch (err) {
      console.error("❌ fetchProductDetail error:", err)
      return products.find(p => p.id === productId) ?? null
    } finally {
      setLoadingDetail(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [walletProvider])

  return {
    products,
    loadingProducts,
    loadingDetail,
    setProducts,
    fetchProductDetail,
    refetchProducts: fetchProducts,
  }
}
