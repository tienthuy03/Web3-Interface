import React, { useEffect, useState } from 'react'
import { toDataURL } from 'qrcode'

type Product = {
  id: string
  name: string
  price: number
  description?: string
}

type Props = {
  product?: Product | null
  onBack: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function ProductDetail({ product, onBack, onEdit, onDelete }: Props) {
  if (!product) return (
    <div className="p-4">
      <button onClick={onBack} className="text-sm text-gray-600 mb-2">← Quay lại</button>
      <div className="text-gray-500">Chưa chọn sản phẩm</div>
    </div>
  )

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    const payload = JSON.stringify({ id: product.id, name: product.name, price: product.price, description: product.description })
    toDataURL(payload, { width: 160 })
      .then(url => setQrDataUrl(url))
      .catch(() => setQrDataUrl(null))
  }, [product])

  return (
    <div className="p-4">
      <div>
        <button onClick={onBack} className="text-sm text-gray-600 mb-2">← Quay lại</button>
        <h2 className="text-xl font-semibold">Chi tiết sản phẩm</h2>

        <div className="border rounded p-4 mt-3 bg-white">
          <div className="text-lg font-medium">{product.name}</div>
          <div className="text-sm text-gray-600">Giá: {product.price.toLocaleString()} VND</div>
          {product.description && (
            <div className="mt-3 text-gray-700">{product.description}</div>
          )}
          <div className="mt-4 flex gap-2">
            <button onClick={() => onEdit(product.id)} className="text-yellow-600">Sửa</button>
            <button onClick={() => onDelete(product.id)} className="text-red-600">Xóa</button>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-2">Mã QR (scan để xem info)</div>
          <div className="p-4 bg-white rounded border flex items-center justify-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt={`QR ${product.id}`} width={180} height={180} />
            ) : (
              <div className="text-sm text-gray-400">Đang tạo QR…</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
