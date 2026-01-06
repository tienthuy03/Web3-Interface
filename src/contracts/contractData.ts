export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS

// Minimal ABI snippets for common read methods used by the UI.
// Replace or extend with the real contract ABI when available.
export const ABI = [
    // CREATE
    "function createProduct(string,string,string,string,string,string,string,string,uint256,uint256,uint256,string,string,string) returns (uint256)",

    // UPDATE
    "function updateProduct(uint256,string,string,string,string,string,string,string,string,uint256,uint256,uint256,string,string,string)",

    // READ
    "function productCounter() view returns (uint256)",
    // Updated ABI to match actual contract schema: id, sku, batchNumber, category, brand, originCountry, name, description, ingredients, manufactureDate, expiryDate, price, currency, owner, scanCount, lastScannedAt, imageURI, documentURI, status, createdAt
    // "function products(uint256) view returns (tuple(uint256,string,string,string,string,string,string,string,string,uint256,uint256,uint256,string,address,uint256,uint256,string,string,uint8,uint256))",
    "function products(uint256) view returns (uint256 id, string sku, string batchNumber, string category, string brand, string originCountry, string name, string description, string ingredients, uint256 manufactureDate, uint256 expiryDate, uint256 price, string currency, address owner, uint256 scanCount, uint256 lastScannedAt, string imageURI, string documentURI, uint8 status, uint256 createdAt)",
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
    "string imageURI," +
    "string documentURI," +
    "uint8 status," +
    "uint256 createdAt" +
    ")[])",

    // ROLE
    "function roles(address) view returns (uint8)",

    //CATEGORY
    // add category
    "function addCategory(string name)",
    // update category name
    "function updateCategory(uint256 id, string newName)",
    // enable / disable category
    "function setCategoryStatus(uint256 id, bool active)",
    // get category by id (public mapping)
    "function categories(uint256) view returns (uint256 id, string name, bool active)",
    // get all
    "function getAllCategories() view returns (tuple(uint256 id, string name, bool active)[])",

    //BRAND
    // add brand
    "function addBrand(string name)",
    // update brand name
    "function updateBrand(uint256 id, string newName)",
    // enable / disable brand
    "function setBrandStatus(uint256 id, bool active)",
    // get brand by id (public mapping)
    "function brands(uint256) view returns (uint256 id, string name, bool active)",
    // get all
    "function getAllBrands() view returns (tuple(uint256 id, string name, bool active)[])",

]
