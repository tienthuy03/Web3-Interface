// import { ethers } from "ethers"
// import { CONTRACT_ADDRESS, ABI } from "./contractData"

// export async function getProvider() {
//   if (typeof window !== "undefined" && (window as any).ethereum) {
//     const browserProvider = new ethers.BrowserProvider((window as any).ethereum)
//     try {
//       await (window as any).ethereum.request({ method: "eth_requestAccounts" })
//     } catch (e) { }
//     return browserProvider
//   }
//   return ethers.getDefaultProvider()
// }

// function getContract(providerOrSigner: any) {
//   return new ethers.Contract(CONTRACT_ADDRESS, ABI, providerOrSigner)
// }

// /**
//  * Try to read products from the contract.
//  * Works with either a `getProducts()` view that returns an array,
//  * or a pair of methods like `productsCount()` + `products(i)`.
//  */
// export async function getProductsFromChain(): Promise<any[]> {
//   const provider = await getProvider()
//   const contract = getContract(provider)

//   // Try getProducts() first
//   try {
//     const res: any = await contract.getProducts()
//     if (Array.isArray(res)) {
//       return res.map((p: any, idx: number) => {
//         const obj = p && typeof p === 'object' ? p : {}
//         return {
//           id: obj.id?.toString() ?? (obj[0]?.toString() ?? String(idx)),
//           name: obj.name ?? obj[1] ?? '',
//           description: obj.description ?? obj[2] ?? '',
//           ingredients: obj.ingredients ?? obj[3] ?? '',
//           manufactureDate: obj.manufactureDate ? Number(obj.manufactureDate.toString()) : (obj[4] ? Number(obj[4].toString()) : 0),
//           expiryDate: obj.expiryDate ? Number(obj.expiryDate.toString()) : (obj[5] ? Number(obj[5].toString()) : 0),
//           price: (() => {
//             try { return Number(ethers.formatUnits(obj.price ?? obj[6] ?? 0, 0)) } catch { return Number((obj.price ?? obj[6] ?? 0).toString()) }
//           })(),
//         }
//       })
//     }
//   } catch (e) {
//     // continue to fallback
//   }

//   // Fallback: try to read count and iterate products(i)
//   const countNames = ['getProductsLength', 'productsCount', 'productsLength', 'getProductsCount', 'productCount', 'getProductCount']
//   for (const name of countNames) {
//     const fn = (contract as any)[name]
//     if (typeof fn === 'function') {
//       try {
//         const c: any = await fn()
//         const count = Number(c.toString())
//         const arr: any[] = []
//         for (let i = 0; i < count; i++) {
//           const p = await (contract as any).products(i)
//           arr.push(p)
//         }
//         return arr.map((p: any, idx: number) => ({
//           id: p.id?.toString() ?? (p[0]?.toString() ?? String(idx)),
//           name: p.name ?? p[1] ?? '',
//           description: p.description ?? p[2] ?? '',
//           ingredients: p.ingredients ?? p[3] ?? '',
//           manufactureDate: p.manufactureDate ? Number(p.manufactureDate.toString()) : (p[4] ? Number(p[4].toString()) : 0),
//           expiryDate: p.expiryDate ? Number(p.expiryDate.toString()) : (p[5] ? Number(p[5].toString()) : 0),
//           price: (() => { try { return Number(ethers.formatUnits(p.price ?? p[6] ?? 0, 0)) } catch { return Number((p.price ?? p[6] ?? 0).toString()) } })(),
//         }))
//       } catch (e) {
//         // ignore and try next
//       }
//     }
//   }

//   // If all attempts fail, return empty array
//   return []
// }

// export default {
//   getProvider,
//   getProductsFromChain,
// }
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, ABI } from "./contractData"

/**
 * Get provider (BrowserProvider nếu có wallet, fallback default)
 */
export async function getProvider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" })
    } catch (e) { }
    return browserProvider
  }
  return ethers.getDefaultProvider()
}

/**
 * Get contract instance
 */
function getContract(providerOrSigner: any) {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, providerOrSigner)
}

/**
 * 🔹 Get SINGLE product by ID
 * uses: products(uint256)
 */
export async function getProductFromChain(productId: number) {
  const provider = await getProvider()
  const contract = getContract(provider)

  const p: any = await contract.products(productId)

  return {
    id: Number(p[0]),
    name: p[1],
    description: p[2],
    ingredients: p[3],
    manufactureDate: Number(p[4]),
    expiryDate: Number(p[5]),
    price: Number(p[6]), // nếu là wei thì format ngoài UI
    owner: p[7],
    status: Number(p[8]),
    createdAt: Number(p[9]),
  }
}

/**
 * 🔹 Get ALL products from chain
 * Compatible with:
 * - productCounter() + products(id)
 */
export async function getProductsFromChain(): Promise<any[]> {
  const provider = await getProvider()
  const contract = getContract(provider)

  // Ưu tiên đúng theo contract của bạn
  if (typeof (contract as any).productCounter === "function") {
    const total: any = await contract.productCounter()
    const count = Number(total.toString())
    const list: any[] = []

    // ⚠️ contract của bạn bắt đầu ID từ 1
    for (let i = 1; i <= count; i++) {
      const p: any = await contract.products(i)

      list.push({
        id: Number(p[0]),
        name: p[1],
        description: p[2],
        ingredients: p[3],
        manufactureDate: Number(p[4]),
        expiryDate: Number(p[5]),
        price: Number(p[6]),
        owner: p[7],
        status: Number(p[8]),
        createdAt: Number(p[9]),
      })
    }

    return list
  }

  // fallback (nếu sau này đổi contract)
  return []
}

export default {
  getProvider,
  getProductFromChain,
  getProductsFromChain,
}
