
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, ABI } from "./contractData"

/**
 * Get provider (BrowserProvider nếu có wallet, fallback default với RPC)
 */
export async function getProvider() {
  // Try to use wallet provider if available
  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      const browserProvider = new ethers.BrowserProvider((window as any).ethereum)
      // Don't request accounts for read-only operations
      return browserProvider
    } catch (e) {
      console.log("Wallet provider failed, using RPC:", e)
    }
  }

  // Use RPC provider for read-only operations (works without wallet)
  const rpcUrl = import.meta.env.VITE_ETH_SEPOLIA_RPC_URL
  console.log('🔧 getProvider: RPC URL from env:', rpcUrl ? 'Found' : 'Not found')

  if (rpcUrl) {
    try {
      console.log('🔧 getProvider: Using custom RPC:', rpcUrl)
      return new ethers.JsonRpcProvider(rpcUrl)
    } catch (err) {
      console.error('❌ getProvider: Failed to create custom RPC provider:', err)
    }
  }

  // Fallback to public RPC providers
  console.log('🔧 getProvider: Using public Sepolia RPC')
  try {
    // Try multiple public RPC endpoints
    const publicRpcs = [
      'https://rpc.sepolia.org',
      'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', // Public Infura key
      'https://ethereum-sepolia-rpc.publicnode.com'
    ]

    for (const rpc of publicRpcs) {
      try {
        const provider = new ethers.JsonRpcProvider(rpc)
        // Test connection
        await provider.getBlockNumber()
        console.log('✅ getProvider: Connected to public RPC:', rpc)
        return provider
      } catch (err) {
        console.log('⚠️ getProvider: Failed to connect to:', rpc)
        continue
      }
    }
  } catch (err) {
    console.error('❌ getProvider: All RPC providers failed:', err)
  }

  // Last resort: default provider
  console.log('🔧 getProvider: Using ethers default provider')
  return ethers.getDefaultProvider("sepolia")
}

/**
 * Get contract instance
 */
function getContract(providerOrSigner: any) {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, providerOrSigner)
}

export async function getProductFromChain(productId: number) {
  try {
    console.log(`🔍 getProductFromChain: Starting for product ID: ${productId}`)

    const provider = await getProvider()
    if (!provider) {
      throw new Error('Không thể kết nối đến blockchain. Vui lòng kiểm tra RPC hoặc kết nối mạng.')
    }
    console.log('✅ getProductFromChain: Provider obtained:', provider)

    const contract = getContract(provider)
    // console.log('✅ getProductFromChain: Contract instance created')

    // Check if product exists
    // console.log(`📡 getProductFromChain: Calling contract.products(${productId})`)
    const p: any = await contract.products(productId)
    console.log('📦 getProductFromChain: Raw product data received:', p)
    // console.log('📦 getProductFromChain: Data length:', p?.length)

    // Kiểm tra dữ liệu
    if (!p || (Array.isArray(p) && p.length < 20)) {
      throw new Error(`Sản phẩm ID ${productId} không có dữ liệu đầy đủ`)
    }

    // Map theo đúng response từ contract (20 fields)
    const mapped = {
      // Field chính từ contract
      id: Number(p[0]) || productId,
      sku: p[1],
      batchNumber: p[2],
      category: p[3],
      brand: p[4],
      originCountry: p[5],
      name: p[6],
      description: p[7],
      ingredients: p[8],
      manufactureDate: Number(p[9]) || 0,
      expiryDate: Number(p[10]) || 0,
      price: Number(p[11]) || 0,
      currency: p[12] || 'VND',
      owner: p[13],
      scanCount: Number(p[14]) || 0,
      lastScannedAt: Number(p[15]) || 0,
      imageURI: p[16],
      documentURI: p[17],
      status: Number(p[18]) || 0,
      createdAt: Number(p[19]) || 0,

    }

    console.log('✅ getProductFromChain: Mapped product:', mapped)

    // Validate
    if (mapped.owner === '0x0000000000000000000000000000000000000000' || !mapped.owner) {
      console.warn('⚠️ getProductFromChain: Product owner is zero address')
    }

    return mapped
  } catch (err: any) {
    console.error('❌ getProductFromChain: Error:', err)

    if (err?.message?.includes('execution reverted') || err?.code === 'CALL_EXCEPTION') {
      throw new Error(`Sản phẩm ID ${productId} không tồn tại trên blockchain`)
    }

    throw new Error(`Không thể tải sản phẩm ${productId}: ${err?.message || 'Lỗi không xác định'}`)
  }
}
/**
 * 🔹 Get ALL products from chain
 * Compatible with:
 * - getAllProducts() (preferred)
 * - productCounter() + products(id) (fallback)
 */
export async function getProductsFromChain(provider?: any): Promise<any[]> {
  try {
    // Use provided provider or get default provider
    const finalProvider = provider || await getProvider()
    const contract = getContract(finalProvider)

    // Try getAllProducts() first (more efficient)
    try {
      console.log("🔄 Trying getAllProducts()...")
      const allProducts = await contract.getAllProducts()

      if (Array.isArray(allProducts) && allProducts.length > 0) {
        const mapped = allProducts.map((p: any, index: number) => {
          // Map according to ABI: id, sku, batchCode, category, brand, origin, supplier, distributor, retailer, 
          // manufactureDate, expiryDate, price, currency, owner, status, qualityStatus, imageUrl, documentUrl, verifyStatus, createdAt

          return {
            id: Number(p.id ?? p[0] ?? index + 1),
            sku: p.sku ?? p[1] ?? "",
            batchNumber: p.batchNumber ?? p[2] ?? "",
            category: p.category ?? p[3] ?? "",
            brand: p.brand ?? p[4] ?? "",
            originCountry: p.originCountry ?? p[5] ?? "",
            name: p.name ?? p[6] ?? "",
            description: p.description ?? p[7] ?? "",
            ingredients: p.ingredients ?? p[8] ?? "",
            manufactureDate: Number(p.manufactureDate ?? p[9] ?? 0),
            expiryDate: Number(p.expiryDate ?? p[10] ?? 0),
            price: Number(p.price ?? p[11] ?? 0),
            currency: p.currency ?? p[12] ?? "",
            owner: p.owner ?? p[13] ?? "",
            scanCount: Number(p.scanCount ?? p[14] ?? 0),
            lastScannedAt: Number(p.lastScannedAt ?? p[15] ?? 0),
            imageUrl: p.imageUrl ?? p[16] ?? "",
            documentUrl: p.documentUrl ?? p[17] ?? "",
            status: Number(p.verifyStatus ?? p[18] ?? 0),
            createdAt: Number(p.createdAt ?? p[19] ?? 0),
          }
        })

        console.log("✅ getAllProducts() success, products:", mapped.length)
        return mapped
      } else {
        console.log("ℹ️ getAllProducts() returned empty array")
      }
    } catch (getAllErr) {
      console.log("⚠️ getAllProducts() failed, trying fallback method...", getAllErr)
    }

    // Fallback: use productCounter() + products(id)
    console.log("🔄 Using productCounter() + products(id)...")
    const total = await contract.productCounter()
    const count = Number(total)

    console.log("📊 Total products on chain:", count)

    if (count === 0) {
      console.log("ℹ️ No products found on chain")
      return []
    }

    const list: any[] = []

    for (let i = 1; i <= count; i++) {
      try {
        const p = await contract.products(i)

        list.push({
          id: Number(p[0]),
          batchId: p[1],
          productCode: p[2],
          name: p[3],
          brand: p[4],
          origin: p[5],
          certHash: p[6],
          txHash: p[7],
          metadataHash: p[8],
          manufactureDate: Number(p[9]),
          expiryDate: Number(p[10]),
          price: Number(p[11]),
          currency: p[12],
          owner: p[13],
          status: Number(p[14]),
          verifyStatus: Number(p[15]),
          imageUrl: p[16],
          documentUrl: p[17],
          deleted: Number(p[18]),
          createdAt: Number(p[19]),
        })
      } catch (err) {
        console.error(`❌ Error fetching product ${i}:`, err)
        // Continue with next product
      }
    }

    console.log("✅ getProductsFromChain result:", list)
    return list
  } catch (err) {
    console.error("❌ getProductsFromChain error:", err)
    throw err
  }
}



export default {
  getProvider,
  getProductFromChain,
  getProductsFromChain,
}
