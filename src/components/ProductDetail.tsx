
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
              {formatPrice(product.price)} VND
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
