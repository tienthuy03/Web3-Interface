import React, { useState } from 'react'
import { ethers } from "ethers"
import { toTimestamp } from "../utils/help.tsx";
import { ABI, CONTRACT_ADDRESS } from '../contracts/contractData.ts'
import toast from 'react-hot-toast';

type Product = {
  id: string
  name: string
  price: number
  description?: string
  ingredients?: string
  manufactureDate?: number
  expiryDate?: number
}

type Props = {
  initial?: Partial<Product>
  onSave: (p: { id?: string; name: string; price: number; description?: string, ingredients?: string, manufactureDate?: number, expiryDate?: number }) => void
  onCancel: () => void
}

export async function createProductOnChain(form: {
  name: string
  description?: string
  ingredients?: string
  manufactureDate?: string
  expiryDate?: string
  price: number
}) {
  if (!window.ethereum) {
    alert("Vui lòng cài MetaMask")
    return
  }

  // Request wallet
  await window.ethereum.request({ method: "eth_requestAccounts" })

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  )

  const tx = await contract.createProduct(
    form.name,
    form.description ?? "",
    form.ingredients ?? "",
    toTimestamp(form.manufactureDate!),
    toTimestamp(form.expiryDate!),
    ethers.parseUnits(form.price.toString(), 0) // VND integer
  )

  console.log("⏳ Tx hash:", tx.hash)

  const receipt = await tx.wait()
  console.log("✅ Tx confirmed:", receipt)

  return receipt
}

export default function ProductForm({ initial = {}, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial.name ?? '')
  const [price, setPrice] = useState(initial.price ?? 0)
  const [description, setDescription] = useState(initial.description ?? '')
  const [ingredients, setIngredients] = useState(initial.ingredients ?? '')
  const [manufactureDate, setManufactureDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createProductOnChain({
        name: name.trim(),
        description: description.trim(),
        ingredients: ingredients.trim(),
        manufactureDate,
        expiryDate,
        price
      })

      // Notify parent to update local list immediately
      onSave({
        id: initial.id,
        name: name.trim(),
        price,
        description: description.trim(),
        ingredients: ingredients.trim(),
        manufactureDate: manufactureDate ? Date.parse(manufactureDate) : undefined,
        expiryDate: expiryDate ? Date.parse(expiryDate) : undefined,
      })

      // alert("🎉 Tạo sản phẩm thành công")
      toast.success("🎉 Tạo sản phẩm thành công")

    } catch (err) {
      console.error(err)
      // alert("❌ Tạo sản phẩm thất bại")
      toast.success("❌ Tạo sản phẩm thất bại")

    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tên</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giá (VND)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200" rows={4} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Thành phần</label>
          <textarea
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            className="w-full border rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
            rows={2}
          />
        </div>

        {/* Manufacture Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Ngày sản xuất</label>
          <input
            type="date"
            onChange={e => setManufactureDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Ngày hết hạn</label>
          <input
            type="date"
            onChange={e => setExpiryDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow">Lưu</button>
          <button type="button" onClick={onCancel} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md">Hủy</button>
        </div>
      </div>
    </form>
  )
}
