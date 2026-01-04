import { getInitials } from "../utils/help"
import { useMemo, useState } from "react"

type Product = {
  id: string
  name: string
  price: number
  expiryDate?: number
  status?: number
  image?: string
}

type Props = {
  products: Product[]
  loading?: boolean
  onSelect: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export default function ProductList({
  products,
  onSelect,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}: Props) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "in" | "sold" | "expired" | "stopped">("all")

  const nowSec = Math.floor(Date.now() / 1000)

  function statusLabel(p: Product) {
    if (p.expiryDate && p.expiryDate > 0 && p.expiryDate < nowSec) return "Hết hạn"
    if (p.status === 0) return "Đang lưu hành"
    if (p.status === 1) return "Đã bán"
    return "Ngừng bán"
  }

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
      if (statusFilter === "in") return statusLabel(p) === "Đang lưu hành"
      if (statusFilter === "sold") return statusLabel(p) === "Đã bán"
      if (statusFilter === "expired") return statusLabel(p) === "Hết hạn"
      if (statusFilter === "stopped") return statusLabel(p) === "Ngừng bán"
      return true
    })
  }, [products, query, statusFilter])

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
          <div className="text-xs text-gray-500">Quản lý sản phẩm hiện có</div>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên..."
            className="px-3 py-2 border rounded-lg text-sm w-60"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">Tất cả</option>
            <option value="in">Đang lưu hành</option>
            <option value="sold">Đã bán</option>
            <option value="expired">Hết hạn</option>
            <option value="stopped">Ngừng bán</option>
          </select>

          <button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow text-sm">+ Thêm</button>
        </div>
      </div>

      <div className="grow overflow-auto bg-white rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center p-10 text-gray-500">Đang tải sản phẩm…</div>
        ) : (
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Hạn</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(p.id)}>
                  <td className="px-4 py-3 align-top">#{p.id}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">{getInitials(p.name)}</div>
                      )}
                      <div>
                        <div className="font-medium text-gray-800">{p.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">{p.price.toLocaleString()} VND</td>
                  <td className="px-4 py-3 align-top">
                    <StatusBadge label={statusLabel(p)} />
                  </td>
                  <td className="px-4 py-3 align-top">{p.expiryDate ? new Date(p.expiryDate * 1000).toLocaleDateString('vi-VN') : '-'}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); onEdit(p.id) }} className="text-xs text-yellow-700 hover:underline">Sửa</button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(p.id) }} className="text-xs text-red-600 hover:underline">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Không có sản phẩm</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ label }: { label: string }) {
  const color = label === 'Đang lưu hành' ? 'bg-emerald-100 text-emerald-700' : label === 'Đã bán' ? 'bg-yellow-100 text-yellow-700' : label === 'Hết hạn' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${color}`}>{label}</span>
  )
}
