export const CONTRACT_ADDRESS = "0x081d9ff472e1b25b8820e9a17b2598f52132ccf8"

// Minimal ABI snippets for common read methods used by the UI.
// Replace or extend with the real contract ABI when available.
export const ABI = [
    "function createProduct(string,string,string,uint256,uint256,uint256) public returns (uint256)",
    // READ
    "function productCounter() view returns (uint256)",
    "function products(uint256) view returns (uint256,string,string,string,uint256,uint256,uint256,address,uint8,uint256)",

    // OPTIONAL
    "function getProductHistory(uint256) view returns (tuple(uint8,address,string,string,uint256)[])"
]
