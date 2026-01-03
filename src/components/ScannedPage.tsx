import React from "react"

type Product = {
  id: number
  name: string
  price: number
  description?: string
  ingredients?: string
  manufactureDate?: number
  expiryDate?: number
  createdAt?: number
  owner?: string
  status?: number
  imageUrl?: string
}

type Props = {
  product: Product
}

export default function ScannedPage({ product }: Props) {
  const formatDate = (ts?: number) =>
    ts ? new Date(ts * 1000).toLocaleDateString("vi-VN") : "-"

  const statusLabel =
    product.status === 0 ? "Đang lưu hành" : "Ngừng bán"

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-500 to-emerald-700 p-4">
      {/* Header */}
      <div className="text-center text-white pt-6 pb-12">
        <div className="text-sm opacity-90">Truy xuất nguồn gốc</div>
        <h1 className="text-2xl font-bold mt-1">Thông tin sản phẩm</h1>
      </div>

      {/* Card */}
      <div className="-mt-10 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Image */}
          <div className="relative">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                Chưa có hình ảnh sản phẩm
              </div>
            )}

            {/* Status badge */}
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs bg-emerald-600 text-white shadow">
              {statusLabel}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Name & price */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h2>
              <div className="text-lg font-bold text-emerald-600 mt-1">
                {product.price.toLocaleString()} VND
              </div>
            </div>

            {/* Info rows */}
            <InfoRow label="Mã sản phẩm" value={`#${product.id}`} />
            <InfoRow label="Ngày tạo" value={formatDate(product.createdAt)} />
            <InfoRow
              label="Ngày sản xuất"
              value={formatDate(product.manufactureDate)}
            />
            <InfoRow
              label="Hạn sử dụng"
              value={formatDate(product.expiryDate)}
              highlight
            />

            {/* Owner */}
            {product.owner && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Chủ sở hữu</div>
                <div className="text-xs font-mono bg-gray-50 rounded p-2 break-all">
                  {product.owner}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <InfoBlock label="Thành phần">
                {product.ingredients}
              </InfoBlock>
            )}

            {/* Description */}
            {product.description && (
              <InfoBlock label="Mô tả">
                {product.description}
              </InfoBlock>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== Helpers ===== */

function InfoRow({
  label,
  value,
  highlight
}: {
  label: string
  value?: string
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span
        className={`font-medium ${highlight ? "text-red-600" : "text-gray-800"
          }`}
      >
        {value || "-"}
      </span>
    </div>
  )
}

function InfoBlock({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
        {children}
      </div>
    </div>
  )
}
