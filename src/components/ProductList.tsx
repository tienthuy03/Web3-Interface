import React from 'react'

type Product = {
  id: string
  name: string
  price: number
}

type Props = {
  products: Product[]
  onSelect: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export default function ProductList({ products, onSelect, onEdit, onDelete, onAdd }: Props) {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
          <div className="text-xs text-gray-500">Quản lý sản phẩm hiện có</div>
        </div>
        <button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded shadow">Thêm</button>
      </div>

      <div className="space-y-3">
        {products.length === 0 && (
          <div className="text-gray-500">Chưa có sản phẩm</div>
        )}
        {products.map(p => (
          <div key={p.id} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect(p.id)}>
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-500">PG</div>
              <div>
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-gray-500">Giá: <span className="font-semibold">{p.price.toLocaleString()} VND</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onEdit(p.id)} className="text-xs text-yellow-700 hover:underline">Sửa</button>
              <button onClick={() => onDelete(p.id)} className="text-xs text-red-600 hover:underline">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
