import { getProvider } from "./provider"
import { getContract } from "./contract"

export async function getAllCategories(provider?: any): Promise<any[]> {
    const finalProvider = provider || await getProvider()
    const contract = getContract(finalProvider)

    try {
        const allCategories = await contract.getAllCategories()

        if (Array.isArray(allCategories) && allCategories.length) {
            return allCategories.map((c: any, index: number) => ({
                id: Number(c.id ?? c[0] ?? index + 1),
                name: c.name ?? c[1] ?? "",
                active: Boolean(c.active ?? c[2]),
            }))
        }
    } catch (err) {
        console.error("getAllCategories failed:", err)
    }

    return []
}

/**
 * Create new category
 */
export async function addCategory(
    provider?: any,
    name?: string,
) {
    const finalProvider = provider || await getProvider()
    const signer = await finalProvider.getSigner()
    const contract = getContract(signer)

    const tx = await contract.addCategory(name)
    return await tx.wait()
}

/**
 * Update category name
 */
export async function updateCategory(
    provider: any,
    id: number,
    newName: string
) {
    const finalProvider = provider || await getProvider()
    const signer = await finalProvider.getSigner()
    const contract = getContract(signer)

    const tx = await contract.updateCategory(id, newName)
    return await tx.wait()
}
