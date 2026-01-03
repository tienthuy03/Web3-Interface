// import React, { useEffect, useState } from 'react'
// import { toDataURL } from 'qrcode'

// type Product = {
//   id: string
//   name: string
//   price: number
//   description?: string
//   ingredients?: string
//   manufactureDate?: number
//   expiryDate?: number
// }

// type Props = {
//   product?: Product | null
//   onBack: () => void
//   onEdit: (id: string) => void
//   onDelete: (id: string) => void
// }

// export default function ProductDetail({ product, onBack, onEdit, onDelete }: Props) {
//   if (!product) return (
//     <div className="p-4">
//       <button onClick={onBack} className="text-sm text-gray-600 mb-2">← Quay lại</button>
//       <div className="text-gray-500">Chưa chọn sản phẩm</div>
//     </div>
//   )

//   const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

//   const formatDate = (ts?: number) =>
//       ts ? new Date(ts * 1000).toLocaleDateString('vi-VN') : '-'

//   useEffect(() => {
//     const payload = JSON.stringify({ id: product.id, name: product.name, price: product.price, description: product.description, ingredients: product.ingredients, manufactureDate: product.manufactureDate, expiryDate: product.expiryDate })
//     toDataURL(payload, { width: 160 })
//       .then(url => setQrDataUrl(url))
//       .catch(() => setQrDataUrl(null))
//   }, [product])

//   return (
//     <div className="p-4">
//       <div>
//         <button onClick={onBack} className="text-sm text-gray-600 mb-2">← Quay lại</button>
//         <h2 className="text-xl font-semibold">Chi tiết sản phẩm</h2>

//         <div className="border rounded p-4 mt-3 bg-white">
//           <div className="text-lg font-medium">{product.name}</div>
//           <div className="text-sm text-gray-600">Giá: {product.price.toLocaleString()} VND</div>
//           {product.description && (
//             <div className="mt-3 text-gray-700">{product.description}</div>
//           )}
//           {product.ingredients && (
//               <div className="text-gray-700">
//                 <strong>Thành phần:</strong> {product.ingredients}
//               </div>
//           )}

//           <div className="text-sm text-gray-600">
//             Ngày sản xuất: {formatDate(product.manufactureDate)}
//           </div>

//           <div className="text-sm text-gray-600">
//             Hạn sử dụng: {formatDate(product.expiryDate)}
//           </div>
//           <div className="mt-4 flex gap-2">
//             <button onClick={() => onEdit(product.id)} className="text-yellow-600">Sửa</button>
//             <button onClick={() => onDelete(product.id)} className="text-red-600">Xóa</button>
//           </div>
//         </div>

//         <div className="mt-4">
//           <div className="text-sm text-gray-500 mb-2">Mã QR (scan để xem info)</div>
//           <div className="p-4 bg-white rounded border flex items-center justify-center">
//             {qrDataUrl ? (
//               <img src={qrDataUrl} alt={`QR ${product.id}`} width={180} height={180} />
//             ) : (
//               <div className="text-sm text-gray-400">Đang tạo QR…</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
import React, { useEffect, useState } from 'react'
import { toDataURL } from 'qrcode'

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
  product?: Product | null
  onBack: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function ProductDetail({ product, onBack, onEdit, onDelete }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  if (!product) {
    return (
      <div className="p-4 text-center text-gray-500">
        <button onClick={onBack} className="mb-2 text-sm text-gray-600">← Quay lại</button>
        <div>Chưa chọn sản phẩm</div>
      </div>
    )
  }

  const formatDate = (ts?: number) =>
    ts ? new Date(ts * 1000).toLocaleDateString('vi-VN') : '-'

  useEffect(() => {
    const payload = JSON.stringify({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      ingredients: product.ingredients,
      manufactureDate: product.manufactureDate,
      expiryDate: product.expiryDate
    })

    toDataURL(payload, { width: 180, margin: 2 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
  }, [product])

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-sm text-gray-600 hover:underline">
          ← Quay lại
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(product.id)}
            className="px-3 py-1 text-sm rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          >
            Sửa
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="px-3 py-1 text-sm rounded bg-red-50 text-red-600 hover:bg-red-100"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
          {/* <div className="text-sm text-gray-500">
            ID: <span className="font-mono">{product.id}</span>
          </div> */}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Info label="Giá bán">
            <span className="font-semibold text-gray-800">
              {product.price.toLocaleString()} VND
            </span>
          </Info>

          <Info label="Ngày sản xuất">
            {formatDate(product.manufactureDate)}
          </Info>

          <Info label="Hạn sử dụng">
            <span className="font-medium text-red-600">
              {formatDate(product.expiryDate)}
            </span>
          </Info>
        </div>

        {product.ingredients && (
          <InfoBlock label="Thành phần">
            {product.ingredients}
          </InfoBlock>
        )}

        {product.description && (
          <InfoBlock label="Mô tả">
            {product.description}
          </InfoBlock>
        )}
      </div>

      {/* QR */}
      <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
        <div className="text-sm text-gray-500 mb-2">
          Mã QR truy xuất nguồn gốc
        </div>
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`QR ${product.id}`}
            className="mx-auto w-44 h-44"
          />
        ) : (
          <div className="text-sm text-gray-400">Đang tạo QR…</div>
        )}
      </div>
    </div>
  )
}

/* ===== Small UI helpers ===== */

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-gray-800">{children}</div>
    </div>
  )
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm text-gray-700 bg-gray-50 rounded p-3">
        {children}
      </div>
    </div>
  )
}
