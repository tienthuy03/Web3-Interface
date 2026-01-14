import { getProvider } from "./provider"
import { getContract } from "./contract"

/**
 * Get all brands
 */
export async function getAllBrands(provider?: any): Promise<any[]> {
    const finalProvider = provider || await getProvider()
    const contract = getContract(finalProvider)

    try {
        const allBrands = await contract.getAllBrands()

        if (Array.isArray(allBrands) && allBrands.length) {
            return allBrands.map((b: any, index: number) => ({
                id: Number(b.id ?? b[0] ?? index + 1),
                name: b.name ?? b[1] ?? "",
                active: Boolean(b.active ?? b[2]),
            }))
        }
    } catch (err) {
        console.error("getAllBrands failed:", err)
    }

    return []
}

/**
 * Create new brand
 */
export async function addBrand(
    provider?: any,
    name?: string,
) {
    const finalProvider = provider || await getProvider()
    const signer = await finalProvider.getSigner()
    const contract = getContract(signer)

    const tx = await contract.addBrand(name)
    return await tx.wait()
}

/**
 * Update brand name
 */
export async function updateBrand(
    provider: any,
    id: number,
    newName: string
) {
    const finalProvider = provider || await getProvider()
    const signer = await finalProvider.getSigner()
    const contract = getContract(signer)

    const tx = await contract.updateBrand(id, newName)
    return await tx.wait()
}
