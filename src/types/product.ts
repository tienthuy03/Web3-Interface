export interface ProductFormData {
    sku: string
    batchNumber: string

    category?: string
    brand?: string
    originCountry?: string

    name: string
    description?: string
    ingredients?: string

    manufactureDate: number   // timestamp (seconds)
    expiryDate: number        // timestamp (seconds)

    price: number
    currency: string

    imagePath?: string        // IPFS / server path
    documentPath?: string     // IPFS / server path
}
export type Product = {
    id: string
    name: string
    price: number
    description?: string
    image?: string
    owner?: string
    category?: string
    brand?: string
    currency?: string
    imageUrl?: string
    ingredients?: string
    manufactureDate?: number
    expiryDate?: number
    createdAt?: number
    status?: number
    sku?: string
    origin?: string
    documentUrl?: string
    verifyStatus?: number
    batchNumber?: string
    originCountry?: string
}