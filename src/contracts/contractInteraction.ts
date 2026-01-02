import { ethers } from "ethers"
import { contractAddr, contractABI } from "./contractData"

/**
 * Returns a provider. If `window.ethereum` is available it requests accounts.
 */
export async function getProvider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" })
    } catch (e) { }
    return browserProvider
  }
  return ethers.getDefaultProvider()
}

function getContract(providerOrSigner: any) {
  return new ethers.Contract(contractAddr, contractABI, providerOrSigner)
}

/**
 * Lấy số tiền funding của một `account` (trả về chuỗi ether)
 */
export async function getAccountFunding(account: string): Promise<string> {
  const provider = await getProvider()
  const contract = getContract(provider)
  const funding: any = await contract.getFunding(account)
  try {
    return ethers.formatEther(funding)
  } catch (e) {
    // nếu không phải số wei, trả raw string
    return funding.toString()
  }
}

/**
 * Lấy địa chỉ `funder` theo chỉ số (index)
 */
export async function getFunderByIndex(index: number): Promise<string> {
  const provider = await getProvider()
  const contract = getContract(provider)
  const f = await contract.funders(index)
  return f
}

/**
 * Lấy tổng số funders nếu hợp đồng có hàm `fundersCount`
 */
export async function getFundersCount(): Promise<number> {
  const provider = await getProvider()
  const contract = getContract(provider)
  const c: any = await contract.fundersCount()
  return Number(c.toString())
}

export default {
  getProvider,
  getAccountFunding,
  getFunderByIndex,
  getFundersCount,
}
