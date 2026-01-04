import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  initial?: any
  onSave: (data: any) => void
  onCancel: () => void
  asModal?: boolean
}

const CATEGORY_OPTIONS = ['Thực phẩm', 'Đồ uống', 'Dược phẩm', 'Mỹ phẩm']
const BRAND_OPTIONS = ['Thương hiệu A', 'Thương hiệu B', 'Thương hiệu C']
const COUNTRY_OPTIONS = ['Việt Nam', 'Thái Lan', 'Nhật Bản', 'Mỹ']
const CURRENCY_OPTIONS = ['VND', 'USD']

export default function ProductForm({ initial = {}, onSave, onCancel, asModal = false }: Props) {
  const [sku, setSku] = useState(initial.sku ?? '')
  const [batchNumber, setBatchNumber] = useState(initial.batchNumber ?? '')
  const [category, setCategory] = useState(initial.category ?? CATEGORY_OPTIONS[0])
  const [brand, setBrand] = useState(initial.brand ?? BRAND_OPTIONS[0])
  const [originCountry, setOriginCountry] = useState(initial.originCountry ?? COUNTRY_OPTIONS[0])
  const [name, setName] = useState(initial.name ?? '')
  const [description, setDescription] = useState(initial.description ?? '')
  const [ingredients, setIngredients] = useState(initial.ingredients ?? '')
  const [manufactureDate, setManufactureDate] = useState(initial.manufactureDate ? new Date(initial.manufactureDate).toISOString().slice(0, 10) : '')
  const [expiryDate, setExpiryDate] = useState(initial.expiryDate ? new Date(initial.expiryDate).toISOString().slice(0, 10) : '')
  const [price, setPrice] = useState<number>(initial.price ?? 0)
  const [currency, setCurrency] = useState(initial.currency ?? CURRENCY_OPTIONS[0])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!sku || !batchNumber || !name) {
      return toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
    }

    onSave({
      sku,
      batchNumber,
      category,
      brand,
      originCountry,
      name,
      description,
      ingredients,
      manufactureDate: manufactureDate ? Date.parse(manufactureDate) : undefined,
      expiryDate: expiryDate ? Date.parse(expiryDate) : undefined,
      price,
      currency,
      imageFile,
      documentFile
    })

    toast.success('🎉 Lưu sản phẩm thành công')
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
          <label className="block text-sm font-medium mb-1">Ngày sản xuất</label>
          <input
            type="date"
            onChange={e => setManufactureDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày hết hạn</label>
          <input
            type="date"
            onChange={e => setExpiryDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Giá</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 text-sm"
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
        <label className="inline-flex items-center gap-3 px-4 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm">
          📷 Chọn ảnh
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
          />
        </label>
        {imageFile && <div className="text-xs text-gray-600 mt-1">{imageFile.name}</div>}
      </div>

      {/* Document */}
      <div>
        <label className="block text-sm font-medium mb-1">Tài liệu (PDF/DOC)</label>
        <label className="inline-flex items-center gap-3 px-4 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm">
          📄 Chọn tài liệu
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={e => setDocumentFile(e.target.files?.[0] || null)}
          />
        </label>
        {documentFile && <div className="text-xs text-gray-600 mt-1">{documentFile.name}</div>}
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
          Lưu sản phẩm
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
