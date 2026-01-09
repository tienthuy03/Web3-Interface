import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { ethers } from "ethers"
import { toTimestamp } from "../utils/helpers.tsx";
import { ABI, CONTRACT_ADDRESS } from '../contracts/contractData.ts'
import { uploadFile } from '../utils/fileUpload.tsx'
import type { ProductFormData } from '@/types/product'

type Props = {
  initial?: Partial<ProductFormData>
  onSave: (data: ProductFormData) => Promise<void>
  onCancel: () => void
  asModal?: boolean
}

const CATEGORY_OPTIONS = ['Thực phẩm', 'Đồ uống', 'Dược phẩm', 'Mỹ phẩm']
const BRAND_OPTIONS = ['Thương hiệu A', 'Thương hiệu B', 'Thương hiệu C']
const COUNTRY_OPTIONS = ['Việt Nam', 'Thái Lan', 'Nhật Bản', 'Mỹ']
const CURRENCY_OPTIONS = ['VND', 'USD']

// Helper function to get batch number from various possible field names
const getBatchNumber = (data: any): string => {
  return data?.batchNumber || data?.batchId || data?.batch || data?.batchNo || ''
}

// Helper function to get image URL from various possible field names
const getImageUrl = (data: any): string => {
  return data?.imageUrl || data?.image || data?.imagePath || ''
}

// Helper function to get document URL from various possible field names
const getDocumentUrl = (data: any): string => {
  return data?.documentUrl || data?.document || data?.documentPath || ''
}

// Helper function to get origin/country from various field names
const getOriginCountry = (data: any): string => {
  return data?.originCountry || data?.origin || COUNTRY_OPTIONS[0]
}

export async function createProductOnChain(form: {
  sku: string,
  batchNumber: string,
  category?: string,
  brand?: string,
  originCountry?: string,
  name: string,
  description?: string,
  ingredients?: string,
  currency?: string,
  manufactureDate?: string,
  expiryDate?: string,
  price: number,
  imageFile?: string,
  documentFile?: string,
}) {
  if (!window.ethereum) {
    alert("Vui lòng cài MetaMask")
    return
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const userAddress = await signer.getAddress()

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  )

  const role = await contract.roles(userAddress)
  if (role !== 1n) {
    throw new Error("Chỉ Manufacturer mới được tạo sản phẩm")
  }

  const manufactureTs = toTimestamp(form.manufactureDate!)
  const expiryTs = toTimestamp(form.expiryDate!)
  const now = BigInt(Math.floor(Date.now() / 1000))

  if (manufactureTs > now) {
    throw new Error("Manufacture date is in the future")
  }

  if (expiryTs <= manufactureTs) {
    throw new Error("Invalid expiry date")
  }
  const tx = await contract.createProduct(
    form.sku,
    form.batchNumber,
    form.category,
    form.brand,
    form.originCountry,
    form.name,
    form.description ?? "",
    form.ingredients ?? "",
    toTimestamp(form.manufactureDate!),
    toTimestamp(form.expiryDate!),
    ethers.parseUnits(form.price.toString(), 0),
    form.currency,
    form.imageFile,
    form.documentFile,
  )

  console.log("⏳ Tx hash:", tx.hash)

  const receipt = await tx.wait()
  console.log("✅ Tx confirmed:", receipt)

  return receipt
}

export async function updateProductOnChain(productId: number, form: {
  sku: string,
  batchNumber: string,
  category?: string,
  brand?: string,
  originCountry?: string,
  name: string,
  description?: string,
  ingredients?: string,
  currency?: string,
  manufactureDate?: string,
  expiryDate?: string,
  price: number,
  imageFile?: string,
  documentFile?: string,
}) {
  if (!window.ethereum) {
    alert("Vui lòng cài MetaMask")
    return
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const userAddress = await signer.getAddress()

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  )

  const role = await contract.roles(userAddress)
  if (role !== 1n) {
    throw new Error("Chỉ Manufacturer mới được cập nhật sản phẩm")
  }

  const manufactureTs = toTimestamp(form.manufactureDate!)
  const expiryTs = toTimestamp(form.expiryDate!)
  const now = BigInt(Math.floor(Date.now() / 1000))

  if (manufactureTs > now) {
    throw new Error("Manufacture date is in the future")
  }

  if (expiryTs <= manufactureTs) {
    throw new Error("Invalid expiry date")
  }

  const tx = await contract.updateProduct(
    BigInt(productId),
    form.sku,
    form.batchNumber,
    form.category,
    form.brand,
    form.originCountry,
    form.name,
    form.description ?? "",
    form.ingredients ?? "",
    toTimestamp(form.manufactureDate!),
    toTimestamp(form.expiryDate!),
    ethers.parseUnits(form.price.toString(), 0),
    form.currency,
    form.imageFile,
    form.documentFile,
  )

  console.log("⏳ Update Tx hash:", tx.hash)

  const receipt = await tx.wait()
  console.log("✅ Update Tx confirmed:", receipt)

  return receipt
}

export default function ProductForm({ initial = {}, onSave, onCancel, asModal = false }: Props) {
  // Initialize state with proper field mapping
  const [sku, setSku] = useState(initial.sku ?? '')
  const [batchNumber, setBatchNumber] = useState(getBatchNumber(initial))
  const [category, setCategory] = useState(initial.category ?? CATEGORY_OPTIONS[0])
  const [brand, setBrand] = useState(initial.brand ?? BRAND_OPTIONS[0])
  const [originCountry, setOriginCountry] = useState(getOriginCountry(initial))
  const [name, setName] = useState(initial.name ?? '')
  const [description, setDescription] = useState(initial.description ?? '')
  const [ingredients, setIngredients] = useState(initial.ingredients ?? '')

  // Convert timestamp (seconds or milliseconds) to YYYY-MM-DD format
  const formatDateForInput = (timestamp?: number): string => {
    if (!timestamp || timestamp === 0) return ''
    // If timestamp is in seconds (less than 1e12), convert to milliseconds
    const ms = timestamp > 1e12 ? timestamp : timestamp * 1000
    try {
      return new Date(ms).toISOString().slice(0, 10)
    } catch {
      return ''
    }
  }

  const [manufactureDate, setManufactureDate] = useState(formatDateForInput(initial.manufactureDate))
  const [expiryDate, setExpiryDate] = useState(formatDateForInput(initial.expiryDate))
  const [price, setPrice] = useState<number>(initial.price ?? 0)
  const [currency, setCurrency] = useState(initial.currency ?? CURRENCY_OPTIONS[0])

  // File states
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)

  // Keep track of existing URLs (when editing)
  const [currentImageUrl, setCurrentImageUrl] = useState(getImageUrl(initial))
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState(getDocumentUrl(initial))

  const isEdit = !!(initial as any).id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sku || !batchNumber || !name || !manufactureDate || !expiryDate || !price || price <= 0) {
      return toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc (SKU, Số lô, Tên sản phẩm, Ngày sản xuất, Ngày hết hạn, Giá)')
    }

    const loadingToast = toast.loading(isEdit ? 'Đang cập nhật sản phẩm...' : 'Đang tạo sản phẩm...')

    try {
      let imageFilePath = currentImageUrl // Keep existing URL if no new file
      let documentFilePath = currentDocumentUrl

      // Upload new files if provided
      try {
        if (imageFile) {
          imageFilePath = await uploadFile(imageFile)
        }
        if (documentFile) {
          documentFilePath = await uploadFile(documentFile)
        }
      } catch (uploadErr: any) {
        toast.dismiss(loadingToast)
        return toast.error(`Lỗi upload file: ${uploadErr?.message || 'Không thể upload file'}`)
      }

      if (isEdit) {
        // Update existing product
        const productId = Number((initial as any).id)
        console.log(productId, imageFilePath, documentFilePath)
        try {
          await updateProductOnChain(productId, {
            sku,
            batchNumber,
            category,
            brand,
            originCountry,
            name: name.trim(),
            description: description.trim(),
            ingredients: ingredients.trim(),
            manufactureDate: manufactureDate,
            expiryDate: expiryDate,
            price,
            currency,
            imageFile: imageFilePath,
            documentFile: documentFilePath
          })
          toast.dismiss(loadingToast)
          toast.success('✅ Cập nhật sản phẩm thành công!')
        } catch (updateErr: any) {
          toast.dismiss(loadingToast)
          throw updateErr
        }
        return;
      } else {
        // Create new product
        try {
          await createProductOnChain({
            sku,
            batchNumber,
            category,
            brand,
            originCountry,
            name: name.trim(),
            description: description.trim(),
            ingredients: ingredients.trim(),
            manufactureDate: manufactureDate,
            expiryDate: expiryDate,
            price,
            currency,
            imageFile: imageFilePath,
            documentFile: documentFilePath
          })
          toast.dismiss(loadingToast)
          toast.success('✅ Tạo sản phẩm thành công!')
        } catch (createErr: any) {
          toast.dismiss(loadingToast)
          throw createErr
        }
      }

      // Call onSave callback
      await onSave({
        sku,
        batchNumber,
        category,
        brand,
        originCountry,
        name: name.trim(),
        description: description.trim(),
        ingredients: ingredients.trim(),
        manufactureDate: manufactureDate ? new Date(manufactureDate).getTime() / 1000 : undefined,
        expiryDate: expiryDate ? new Date(expiryDate).getTime() / 1000 : undefined,
        price,
        currency,
        imagePath: imageFilePath,
        documentPath: documentFilePath
      })
    } catch (err: any) {
      console.error('ProductForm error:', err)
      const errorMessage = err?.message || err?.reason || (isEdit ? 'Cập nhật sản phẩm thất bại' : 'Tạo sản phẩm thất bại')
      toast.error(`❌ ${errorMessage}`)
    }
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* SKU + Batch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mã SKU *</label>
          <input
            value={sku}
            onChange={e => setSku(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số lô *</label>
          <input
            value={batchNumber}
            onChange={e => setBatchNumber(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
      </div>

      {/* Category + Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            {CATEGORY_OPTIONS.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Thương hiệu</label>
          <select
            value={brand}
            onChange={e => setBrand(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            {BRAND_OPTIONS.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Origin + Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quốc gia xuất xứ</label>
          <select
            value={originCountry}
            onChange={e => setOriginCountry(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            {COUNTRY_OPTIONS.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-medium mb-1">Thành phần</label>
        <textarea
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          rows={2}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ngày sản xuất *</label>
          <input
            type="date"
            value={manufactureDate}
            onChange={e => setManufactureDate(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày hết hạn *</label>
          <input
            type="date"
            value={expiryDate}
            onChange={e => setExpiryDate(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Giá *</label>
          <input
            type="number"
            min="0"
            step="1"
            value={price || ''}
            onChange={e => {
              const val = e.target.value
              setPrice(val === '' ? 0 : Math.max(0, Math.floor(Number(val))))
            }}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Đơn vị tiền</label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            {CURRENCY_OPTIONS.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium mb-1">Ảnh sản phẩm</label>

        {/* Display current image if exists */}
        {currentImageUrl && !imageFile && (
          <div className="mb-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">📷 Ảnh hiện tại:</span>
                <a
                  href={currentImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Xem ảnh
                </a>
              </div>
              <button
                type="button"
                onClick={() => setCurrentImageUrl('')}
                className="text-xs text-red-600 hover:text-red-700"
              >
                ✕ Xóa
              </button>
            </div>
          </div>
        )}

        <label className="inline-flex items-center gap-3 px-4 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm">
          📷 {imageFile || currentImageUrl ? 'Thay đổi ảnh' : 'Chọn ảnh'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0] || null
              setImageFile(file)
              if (file) setCurrentImageUrl('') // Clear old URL when selecting new file
            }}
          />
        </label>
        {imageFile && (
          <div className="text-xs text-green-600 mt-1 flex items-center gap-2">
            <span>✓ {imageFile.name}</span>
            <button
              type="button"
              onClick={() => setImageFile(null)}
              className="text-red-600 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Document */}
      <div>
        <label className="block text-sm font-medium mb-1">Tài liệu (PDF/DOC)</label>

        {/* Display current document if exists */}
        {currentDocumentUrl && !documentFile && (
          <div className="mb-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">📄 Tài liệu hiện tại:</span>
                <a
                  href={currentDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Xem tài liệu
                </a>
              </div>
              <button
                type="button"
                onClick={() => setCurrentDocumentUrl('')}
                className="text-xs text-red-600 hover:text-red-700"
              >
                ✕ Xóa
              </button>
            </div>
          </div>
        )}

        <label className="inline-flex items-center gap-3 px-4 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm">
          📄 {documentFile || currentDocumentUrl ? 'Thay đổi tài liệu' : 'Chọn tài liệu'}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0] || null
              setDocumentFile(file)
              if (file) setCurrentDocumentUrl('') // Clear old URL when selecting new file
            }}
          />
        </label>
        {documentFile && (
          <div className="text-xs text-green-600 mt-1 flex items-center gap-2">
            <span>✓ {documentFile.name}</span>
            <button
              type="button"
              onClick={() => setDocumentFile(null)}
              className="text-red-600 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          {isEdit ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
        </button>
      </div>
    </form>
  )

  if (!asModal) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-4 rounded-xl shadow">
        {form}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-2xl bg-white p-4 rounded-xl shadow max-h-[85vh] overflow-auto">
        {form}
      </div>
    </div>
  )
}