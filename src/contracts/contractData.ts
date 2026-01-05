export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS

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
    "string originCountry," +
    "string name," +
    "string description," +
    "string ingredients," +
    "uint256 manufactureDate," +
    "uint256 expiryDate," +
    "uint256 price," +
    "string currency," +
    "address owner," +
    "uint8 scanCount," +
    "uint8 scanCount," +
    "string imageURI," +
    "string documentURI," +
    "uint8 status," +
    "uint256 createdAt" +
    ")[])",

    // ROLE
    "function roles(address) view returns (uint8)"
]
