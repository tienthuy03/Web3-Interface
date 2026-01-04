export const CONTRACT_ADDRESS = "0x493d65cb75f004998bab84d922ab41c959d4db52"

// Minimal ABI snippets for common read methods used by the UI.
// Replace or extend with the real contract ABI when available.
export const ABI = [
    // CREATE
    "function createProduct(string,string,string,string,string,string,string,string,uint256,uint256,uint256,string,string,string) returns (uint256)",

    // READ
    "function productCounter() view returns (uint256)",
    // Updated ABI to match actual contract schema: id, sku, batchNumber, category, brand, originCountry, name, description, ingredients, manufactureDate, expiryDate, price, currency, owner, scanCount, lastScannedAt, imageURI, documentURI, status, createdAt
    "function products(uint256) view returns (tuple(uint256,string,string,string,string,string,string,string,string,uint256,uint256,uint256,string,address,uint256,uint256,string,string,uint8,uint256))",

    "function getAllProducts() view returns (tuple(" +
    "uint256 id," +
    "string sku," +
    "string batchCode," +
    "string category," +
    "string brand," +
    "string origin," +
    "string supplier," +
    "string distributor," +
    "string retailer," +
    "uint256 manufactureDate," +
    "uint256 expiryDate," +
    "uint256 price," +
    "string currency," +
    "address owner," +
    "uint8 status," +
    "uint8 qualityStatus," +
    "string imageUrl," +
    "string documentUrl," +
    "uint8 verifyStatus," +
    "uint256 createdAt" +
    ")[])",

    // ROLE
    "function roles(address) view returns (uint8)"
]
