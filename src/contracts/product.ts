import { ethers } from "ethers"
import { getProvider } from "./provider"
import { getContract } from "./contract"

/**
 * Lấy 1 product theo ID
 */
export async function getProductFromChain(productId: number) {
    const provider = await getProvider()
    const contract = getContract(provider)

    const p = await contract.products(productId)

    if (!p.owner || p.owner === ethers.ZeroAddress) {
        return null
    }

    return {
        id: p.id?.toString() ?? productId.toString(),
        sku: p.sku ?? "",
        batchNumber: p.batchNumber ?? "",
        category: p.category ?? "",
        brand: p.brand ?? "",
        originCountry: p.originCountry ?? "",
        name: p.name ?? "",
        description: p.description ?? "",
        ingredients: p.ingredients ?? "",
        manufactureDate: Number(p.manufactureDate ?? 0),
        expiryDate: Number(p.expiryDate ?? 0),
        price: Number(p.price ?? 0),
        currency: p.currency ?? "VND",
        owner: p.owner,
        scanCount: Number(p.scanCount ?? 0),
        lastScannedAt: Number(p.lastScannedAt ?? 0),
        imageURI: p.imageURI ?? "",
        documentURI: p.documentURI ?? "",
        status: Number(p.status ?? 0),
        createdAt: Number(p.createdAt ?? 0),
    }
}

/**
 * Lấy toàn bộ product
 */
export async function getProductsFromChain(provider?: any): Promise<any[]> {
    const finalProvider = provider || await getProvider()
    const contract = getContract(finalProvider)

    // ✅ Ưu tiên getAllProducts
    try {
        const allProducts = await contract.getAllProducts()
        if (Array.isArray(allProducts) && allProducts.length) {
            return allProducts.map((p: any, index: number) => ({
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
            }))
        }
    } catch {
        // fallback bên dưới
    }

    // 🔁 Fallback: productCounter + products(id)
    const total = Number(await contract.productCounter())
    const list: any[] = []

    for (let i = 1; i <= total; i++) {
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
                createdAt: Number(p[19]),
            })
        } catch {
            continue
        }
    }

    return list
}
