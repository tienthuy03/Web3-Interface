export const CONTRACT_ADDRESS = "0x493d65cb75f004998bab84d922ab41c959d4db52"

// Minimal ABI snippets for common read methods used by the UI.
// Replace or extend with the real contract ABI when available.
export const ABI = [
    "function createProduct(string,string,string,string,string,string,string,string,uint256,uint256,uint256,string,string,string) returns (uint256)",
    // READ
    "function productCounter() view returns (uint256)",
    "function products(uint256) view returns (tuple(uint256,string,string,string,string,string,string,string,string,uint256,uint256,uint256,string,address,uint256,uint256,string,string,uint8,uint256))",

    // OPTIONAL
    "function getProductHistory(uint256) view returns (tuple(uint8,address,string,string,uint256)[])",

    // ROLE (mapping getter)
    "function roles(address) view returns (uint8)",
]
