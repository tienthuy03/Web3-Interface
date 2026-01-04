
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
  image?: string
  imageUrl?: string
  // Additional fields from blockchain
  batchId?: string
  productCode?: string
  brand?: string
  origin?: string
  category?: string
  currency?: string
  owner?: string
  status?: number
  verifyStatus?: number
  createdAt?: number
  certHash?: string
  txHash?: string
  metadataHash?: string
  documentUrl?: string
  deleted?: number
}

type Props = {
  product?: Product | null
  onBack: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

type TimelineItem = { title: string; ts?: number; by?: string; note?: string }

type Role = 'manufacturer' | 'owner' | 'consumer' | 'viewer'

type PropsExtended = {
  product?: Product | null
  role?: Role
  onAction?: (action: string) => void
  onScanClick?: (p: any) => void
  onBack: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function ProductDetail({ product, role = 'viewer', onAction, onScanClick, onBack, onEdit, onDelete }: PropsExtended) {
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
    ts ? new Date(ts > 1e12 ? ts : ts * 1000).toLocaleDateString('vi-VN') : '-'

  useEffect(() => {
    if (!product) return

    // Generate URL for QR code
    // Use current hostname - if accessing via IP, it will use IP
    // If accessing via localhost, user needs to access via network IP
    const hostname = window.location.hostname
    const protocol = window.location.protocol
    const port = window.location.port ? `:${window.location.port}` : ''

    // Replace localhost with actual network IP if available
    // For mobile devices, they need to access via network IP like http://192.168.1.x:5173
    let baseUrl = `${protocol}//${hostname}${port}`

    // If on localhost, show a note that user should use network IP
    // But we can't detect network IP from browser, so we'll use what's in the URL
    const productUrl = `${baseUrl}/products/${product.id}`

    console.log('QR Code URL:', productUrl)

    toDataURL(productUrl, { width: 180, margin: 2 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
  }, [product])

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      {/* Main card */}
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
                  // Show placeholder if image fails to load
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
            {product.origin || '-'}
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

        {/* Timeline + Action area */}
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-2">Timeline chuỗi cung ứng</div>
            <div className="space-y-3">
              {(() => {
                const timeline = buildTimeline(product)
                return timeline.map((item, i) => (
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
                ))
              })()}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">Hành động</div>
            <div className="bg-gray-50 rounded p-3">
              {renderActions(role, product, onAction, onEdit, onDelete, onBack, onScanClick)}
            </div>
          </div>
        </div>
      </div>

      {/* QR */}
      <div className="bg-white rounded-xl border shadow-sm p-4 text-center">
        <div className="text-sm text-gray-500 mb-2">
          Mã QR truy xuất nguồn gốc
        </div>
        {qrDataUrl ? (
          <>
            <img
              src={qrDataUrl}
              alt={`QR ${product.id}`}
              className="mx-auto w-44 h-44"
            />
            {window.location.hostname === 'localhost' && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                ⚠️ Để quét trên điện thoại, truy cập app qua IP mạng (ví dụ: http://192.168.1.x:5173) thay vì localhost
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-400">Đang tạo QR…</div>
        )}
      </div>
    </div>
  )
}

function formatPrice(v: any) {
  const n = Number(v ?? 0)
  if (Number.isNaN(n)) return '0'
  try { return n.toLocaleString() } catch { return String(n) }
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
  const verifyLabels: Record<number, { label: string; color: string; description: string }> = {
    0: { label: 'Chưa xác minh', color: 'bg-gray-100 text-gray-600', description: 'Sản phẩm chưa được kiểm tra/xác minh' },
    1: { label: 'Đã xác minh', color: 'bg-green-100 text-green-700', description: 'Sản phẩm đã được xác minh hợp lệ' },
    2: { label: 'Bị từ chối', color: 'bg-red-100 text-red-700', description: 'Sản phẩm không đạt yêu cầu' },
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

/* ===== Helpers for timeline & actions ===== */

function buildTimeline(product?: Product | null) {
  if (!product) return []

  // If product provides an events array, use it (flexible on-chain reconstruction)
  const events = (product as any).events
  if (Array.isArray(events) && events.length > 0) {
    // Expect events: { type, ts, by, note, meta }
    return events.map((e: any) => ({
      title: typeof e.type === 'string' ? prettyEventTitle(e.type) : (e.title ?? 'Event'),
      ts: e.ts ? Number(e.ts) : undefined,
      by: e.by,
      note: e.note ?? (e.meta ? JSON.stringify(e.meta) : undefined),
    }))
  }

  const arr: TimelineItem[] = []
  if ((product as any).createdAt) arr.push({ title: 'Product created', ts: (product as any).createdAt, by: (product as any).owner })
  if (product.manufactureDate) arr.push({ title: 'Manufactured', ts: product.manufactureDate })
  if ((product as any).qualityCheckedAt) arr.push({ title: 'Quality checked', ts: (product as any).qualityCheckedAt, by: (product as any).inspector, note: (product as any).qualityNote })
  if ((product as any).packagedAt) arr.push({ title: 'Packaged', ts: (product as any).packagedAt })
  if ((product as any).shippedAt) arr.push({ title: 'Shipped', ts: (product as any).shippedAt, note: (product as any).carrier })
  if ((product as any).receivedAt) arr.push({ title: 'Received', ts: (product as any).receivedAt, by: (product as any).receiver })
  if ((product as any).owner) arr.push({ title: 'Current owner', by: (product as any).owner })
  if (product.expiryDate) arr.push({ title: 'Expiry', ts: product.expiryDate })
  if ((product as any).soldAt) arr.push({ title: 'Sold', ts: (product as any).soldAt, by: (product as any).buyer })
  if ((product as any).verifiedAt) arr.push({ title: 'Verified', ts: (product as any).verifiedAt, by: (product as any).verifier, note: (product as any).verificationNote })
  if ((product as any).expiredAt) arr.push({ title: 'Disposed / Expired', ts: (product as any).expiredAt })
  return arr
}

function prettyEventTitle(type: string) {
  const map: Record<string, string> = {
    ProductCreated: 'Product created',
    Manufactured: 'Manufactured',
    QualityChecked: 'Quality checked',
    Packaged: 'Packaged',
    Shipped: 'Shipped',
    Received: 'Received',
    OwnershipTransferred: 'Ownership transferred',
    Sold: 'Sold',
    Verified: 'Verified',
    Expired: 'Expired',
  }
  return map[type] ?? type
}

function renderActions(role: Role, product: Product | null | undefined, onAction?: (a: string) => void, onEdit?: (id: string) => void, onDelete?: (id: string) => void, onBack?: () => void, onScanClick?: (p: any) => void) {
  if (!product) return <div className="text-sm text-gray-500">Không có sản phẩm</div>

  if (role === 'manufacturer') {
    return (
      <div className="space-y-2">
        <button onClick={() => onAction?.('create')} className="w-full bg-blue-600 text-white py-2 rounded">Cập nhật sản phẩm</button>
        <button onClick={() => onAction?.('transfer')} className="w-full bg-emerald-600 text-white py-2 rounded">Chuyển giao</button>
      </div>
    )
  }

  if (role === 'owner') {
    return (
      <div className="space-y-2">
        <button onClick={() => onAction?.('transfer')} className="w-full bg-emerald-600 text-white py-2 rounded">Chuyển sở hữu</button>
        <button onClick={() => onEdit?.(product.id)} className="w-full bg-yellow-50 text-yellow-700 py-2 rounded">Sửa thông tin</button>
      </div>
    )
  }

  if (role === 'consumer') {
    return (
      <div className="space-y-2">
        <button onClick={() => onAction?.('verify')} className="w-full bg-indigo-600 text-white py-2 rounded">Xác thực</button>
        <button onClick={() => onScanClick?.(product)} className="w-full bg-blue-600 text-white py-2 rounded">Mở QR</button>
        <button onClick={() => onBack?.()} className="w-full bg-gray-100 py-2 rounded">Quay lại</button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button onClick={() => onAction?.('view')} className="w-full bg-gray-100 py-2 rounded">Xem</button>
    </div>
  )
}
