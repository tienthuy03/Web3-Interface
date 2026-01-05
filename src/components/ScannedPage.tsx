import React from "react"

type Product = {
  id: number | string
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
  // Additional fields
  category?: string
  brand?: string
  originCountry?: string
  currency?: string
  sku?: string
  batchNumber?: string
  batchId?: string
  productCode?: string
  verifyStatus?: number
  certHash?: string
  txHash?: string
  metadataHash?: string
  documentUrl?: string
}

type Props = {
  product: Product
}

export default function ScannedPage({ product }: Props) {
  const formatDate = (ts?: number) =>
    ts ? new Date(ts > 1e12 ? ts : ts * 1000).toLocaleDateString("vi-VN") : "-"

  const formatPrice = (v: any) => {
    const n = Number(v ?? 0)
    if (Number.isNaN(n)) return '0'
    try { return n.toLocaleString() } catch { return String(n) }
  }

  const buildTimeline = () => {
    const arr: Array<{ title: string; ts?: number; by?: string; note?: string }> = []
    if (product.createdAt) arr.push({ title: 'Product created', ts: product.createdAt, by: product.owner })
    if (product.manufactureDate) arr.push({ title: 'Manufactured', ts: product.manufactureDate })
    if (product.owner) arr.push({ title: 'Current owner', by: product.owner })
    if (product.expiryDate) arr.push({ title: 'Expiry', ts: product.expiryDate })
    return arr
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="text-sm text-gray-500">Truy xuất nguồn gốc</div>
            <h1 className="text-2xl font-bold text-gray-800 mt-1">Thông tin sản phẩm</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
          {/* Product Name with Image */}
          <div className="flex items-start gap-4">
            {/* Small Product Image */}
            <div className="flex-shrink-0">
              {(product?.image || product?.imageUrl) ? (
                <img
                  src={product?.image || product?.imageUrl}
                  alt={product?.name ?? ""}
                  className="w-20 h-20 rounded-lg object-cover border shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      const placeholder = document.createElement('div')
                      placeholder.className = "w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                      placeholder.innerHTML = `
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      `
                      parent.appendChild(placeholder)
                    }
                  }}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              )}
            </div>

            {/* Product Name and Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <div className="text-sm text-gray-500 mt-1">
                ID: <span className="font-mono">{product.id}</span>
                {product.productCode && (
                  <> • Mã SP: <span className="font-mono">{product.productCode}</span></>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Giá bán">
              <span className="font-semibold text-gray-800">
                {formatPrice(product.price)} {product.currency || 'VND'}
              </span>
            </Info>

            <Info label="Thương hiệu">
              {product.brand || '-'}
            </Info>

            <Info label="Xuất xứ">
              {product.originCountry || '-'}
            </Info>

            <Info label="Danh mục">
              {product.category || '-'}
            </Info>

            <Info label="Ngày sản xuất">
              {formatDate(product.manufactureDate)}
            </Info>

            <Info label="Hạn sử dụng">
              <span className="font-medium text-red-600">
                {formatDate(product.expiryDate)}
              </span>
            </Info>

            <Info label="Ngày tạo">
              {formatDate(product.createdAt)}
            </Info>

            <Info label="Trạng thái">
              <StatusBadge status={product.status} />
            </Info>

            <Info label="Trạng thái xác minh">
              <VerifyStatusBadge verifyStatus={product.verifyStatus} />
            </Info>
          </div>

          {/* Product Codes */}
          {(product.batchId || product.productCode) && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.batchId && (
                <Info label="Mã lô">
                  <span className="font-mono text-xs">{product.batchId}</span>
                </Info>
              )}
              {product.productCode && (
                <Info label="Mã sản phẩm">
                  <span className="font-mono text-xs">{product.productCode}</span>
                </Info>
              )}
            </div>
          )}

          {/* Blockchain Info */}
          <div className="border-t pt-4">
            <div className="text-xs font-semibold text-gray-500 mb-3">Thông tin Blockchain</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Info label="Chủ sở hữu">
                <span className="font-mono text-xs break-all">{product.owner || '-'}</span>
              </Info>
              {product.txHash && (
                <Info label="Transaction Hash">
                  <span className="font-mono text-xs break-all">{product.txHash}</span>
                </Info>
              )}
              {product.certHash && (
                <Info label="Certificate Hash">
                  <span className="font-mono text-xs break-all">{product.certHash}</span>
                </Info>
              )}
              {product.metadataHash && (
                <Info label="Metadata Hash">
                  <span className="font-mono text-xs break-all">{product.metadataHash}</span>
                </Info>
              )}
              {product.documentUrl && (
                <Info label="Tài liệu">
                  <a href={product.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                    Xem tài liệu
                  </a>
                </Info>
              )}
            </div>
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

          {/* Timeline */}
          {(() => {
            const timeline = buildTimeline()
            if (timeline.length === 0) return null
            return (
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">Timeline chuỗi cung ứng</div>
                <div className="space-y-3">
                  {timeline.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 flex flex-col items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
                        {i < timeline.length - 1 && <div className="w-px bg-gray-200 flex-1 mt-1" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        {item.note && <div className="text-xs text-gray-500">{item.note}</div>}
                        <div className="text-xs text-gray-400">{item.ts ? new Date(item.ts * 1000).toLocaleString('vi-VN') : ''} {item.by ? `• ${item.by}` : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

/* ===== Helpers ===== */

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

function StatusBadge({ status }: { status?: number }) {
  const statusLabels: Record<number, { label: string; color: string }> = {
    0: { label: 'Đang lưu hành', color: 'bg-emerald-100 text-emerald-700' },
    1: { label: 'Đã bán', color: 'bg-yellow-100 text-yellow-700' },
    2: { label: 'Ngừng bán', color: 'bg-gray-100 text-gray-700' },
  }

  if (status === undefined || !statusLabels[status]) {
    return <span className="text-gray-500">-</span>
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${statusLabels[status].color}`}>
      {statusLabels[status].label}
    </span>
  )
}

function VerifyStatusBadge({ verifyStatus }: { verifyStatus?: number }) {
  const verifyLabels: Record<number, { label: string; color: string }> = {
    0: { label: 'Chưa xác minh', color: 'bg-gray-100 text-gray-600' },
    1: { label: 'Đã xác minh', color: 'bg-green-100 text-green-700' },
    2: { label: 'Bị từ chối', color: 'bg-red-100 text-red-700' },
  }

  if (verifyStatus === undefined || !verifyLabels[verifyStatus]) {
    return <span className="text-gray-500">-</span>
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${verifyLabels[verifyStatus].color}`}>
      {verifyLabels[verifyStatus].label}
    </span>
  )
}
