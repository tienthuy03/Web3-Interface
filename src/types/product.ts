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
