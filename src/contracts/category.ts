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
