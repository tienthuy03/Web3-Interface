import React, { useState } from 'react'

type Product = {
  id: string
  name: string
}

type Props = {
  products: Product[]
  onTransfer: (payload: {
    productId: string
    newOwner: string
    location?: string
    note?: string
  }) => void
  onBack?: () => void
}

export default function TransferProduct({ products, onTransfer, onBack }: Props) {
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [newOwner, setNewOwner] = useState('')
  const [location, setLocation] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId) return alert('Chọn sản phẩm')
    if (!newOwner.trim()) return alert('Nhập địa chỉ owner mới')

    onTransfer({
      productId,
      newOwner: newOwner.trim(),
      location: location.trim() || undefined,
      note: note.trim() || undefined
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">

        <div>
          <h1 className="text-xl font-semibold">Transfer Product</h1>
          <p className="text-sm text-gray-500">
            Chuyển quyền sở hữu sản phẩm trong chuỗi cung ứng
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex justify-center items-start px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white rounded-xl shadow p-6 space-y-6"
        >
          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sản phẩm
            </label>
            <select
              value={productId}
              onChange={e => setProductId(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} #{p.id}
                </option>
              ))}
            </select>
          </div>

          {/* New Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner mới (ví blockchain)
            </label>
            <input
              value={newOwner}
              onChange={e => setNewOwner(e.target.value)}
              placeholder="0xABC..."
              className="w-full border rounded-lg px-4 py-2 text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Warehouse A – TP.HCM"
              className="w-full border rounded-lg px-4 py-2 text-sm"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={4}
              placeholder="Ví dụ: Giao lô buổi sáng, tình trạng nguyên vẹn"
              className="w-full border rounded-lg px-4 py-2 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setNewOwner('')
                setLocation('')
                setNote('')
              }}
              className="px-5 py-2 rounded-lg bg-gray-100 text-sm"
            >
              Reset
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
            >
              🚚 Transfer Ownership
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
