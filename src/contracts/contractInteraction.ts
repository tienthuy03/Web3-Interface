
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, ABI } from "./contractData"

export async function getProvider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      const browserProvider = new ethers.BrowserProvider((window as any).ethereum)
      return browserProvider
    } catch (e) {
      console.log("Wallet provider failed, using RPC:", e)
    }
  }
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

  console.log('🔧 getProvider: Using public Sepolia RPC')
  try {
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
  console.log('🔧 getProvider: Using ethers default provider')
  return ethers.getDefaultProvider("sepolia")
}

function getContract(providerOrSigner: any) {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, providerOrSigner)
}

export async function getProductFromChain(productId: number) {
  try {
    const provider = await getProvider();
    const contract = getContract(provider);

    console.log(`📡 [STEP 4] Đang gọi contract.products(${productId})...`);

    const p = await contract.products(productId);
    console.log('📦 [STEP 5] Dữ liệu nhận được:', p);

    if (!p.owner || p.owner === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    const mapped = {
      id: p.id?.toString() || productId.toString(),
      sku: p.sku || '',
      batchNumber: p.batchNumber || '',
      category: p.category || '',
      brand: p.brand || '',
      originCountry: p.originCountry || '',
      name: p.name || '',
      description: p.description || '',
      ingredients: p.ingredients || '',
      manufactureDate: Number(p.manufactureDate || 0),
      expiryDate: Number(p.expiryDate || 0),
      price: Number(p.price || 0),
      currency: p.currency || 'VND',
      owner: p.owner,
      scanCount: Number(p.scanCount || 0),
      lastScannedAt: Number(p.lastScannedAt || 0),
      imageURI: p.imageURI || '',
      documentURI: p.documentURI || '',
      status: Number(p.status || 0),
      createdAt: Number(p.createdAt || 0),
    };

    console.log('✅ [SUCCESS] Đã Map dữ liệu thành công:', mapped);
    return mapped;

  } catch (err: any) {
    console.error('❌ [FATAL ERROR]:', err.message);
    throw err;
  }
}

export async function getProductsFromChain(provider?: any): Promise<any[]> {
  try {
    const finalProvider = provider || await getProvider()
    const contract = getContract(finalProvider)

    try {
      console.log("🔄 Trying getAllProducts()...")
      const allProducts = await contract.getAllProducts()

      if (Array.isArray(allProducts) && allProducts.length > 0) {
        const mapped = allProducts.map((p: any, index: number) => {
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
          name: p[3],
          brand: p[4],
          origin: p[5],
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

export async function getAllCategory(provider?: any): Promise<any[]> {
  try {
    const finalProvider = provider || await getProvider()
    const contract = getContract(finalProvider)

    try {
      const allCategories = await contract.getAllCategories()

      if (Array.isArray(allCategories) && allCategories?.length > 0) {
        const mapped = allCategories.map((p: any, index: number) => {

          return {
            id: Number(p.id ?? p[0] ?? index + 1),
            name: p.name ?? p[1] ?? "",
            active: p.active ?? p[2] ?? "",
          }
        })

        return mapped
      }
    } catch (getAllErr) {
      console.log("⚠️ getAllCategories failed, trying fallback method...", getAllErr)
    }
  } catch (err) {
    console.error("❌ getAllCategories error:", err)
    throw err
  }
}



export default {
  getProvider,
  getProductFromChain,
  getProductsFromChain,
}
