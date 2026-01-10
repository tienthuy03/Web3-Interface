import { ethers } from "ethers"
import { CONTRACT_ADDRESS, ABI } from "./contractData"

export function getContract(providerOrSigner: any) {
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, providerOrSigner)
}
