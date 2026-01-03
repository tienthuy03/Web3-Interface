// import { getInitials } from "../utils/help"

// type Product = {
//   id: string
//   name: string
//   price: number
// }

// type Props = {
//   products: Product[]
//   onSelect: (id: string) => void
//   onEdit: (id: string) => void
//   onDelete: (id: string) => void
//   onAdd: () => void
// }

// export default function ProductList({ products, onSelect, onEdit, onDelete, onAdd }: Props) {
//   return (
//     <div className="p-5">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
//           <div className="text-xs text-gray-500">Quản lý sản phẩm hiện có</div>
//         </div>
//         <button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded shadow">Thêm</button>
//       </div>

//       <div className="space-y-3">
//         {products.length === 0 && (
//           <div className="text-gray-500">Chưa có sản phẩm</div>
//         )}
//         {products.map(p => (
//           <div key={p.id} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:shadow-md transition-shadow bg-white">
//             <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect(p.id)}>
//               <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-500">{getInitials(p.name)}</div>
//               <div>
//                 <div className="font-medium text-sm">{p.name}</div>
//                 <div className="text-xs text-gray-500">Giá: <span className="font-semibold">{p.price.toLocaleString()} VND</span></div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => onEdit(p.id)} className="text-xs text-yellow-700 hover:underline">Sửa</button>
//               <button onClick={() => onDelete(p.id)} className="text-xs text-red-600 hover:underline">Xóa</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

import { getInitials } from "../utils/help"

type Product = {
  id: string
  name: string
  price: number
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
  return (
    <div className="p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
          <div className="text-xs text-gray-500">
            Quản lý sản phẩm hiện có
          </div>
        </div>

        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white
                     px-3 py-2 rounded-lg shadow text-sm"
        >
          + Thêm
        </button>
      </div>

      {/* List */}
      <div className="space-y-3 overflow-auto">
        {/* {products.length === 0 && (
          <div className="text-gray-500 text-sm">
            Chưa có sản phẩm
          </div>
        )} */}
        {loading && (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <svg className="animate-spin h-5 w-5 mr-2 text-gray-400" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Đang tải sản phẩm ...
          </div>
        )}

        {!loading && products.map(p => (
          <div
            key={p.id}
            className="
              flex items-center justify-between gap-4 p-3
              rounded-xl bg-white
              border border-transparent
              hover:border-gray-200
              hover:shadow-sm
              transition-all
            "
          >
            {/* Left: click select */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                console.log("SELECT PRODUCT:", p.id)
                onSelect(p.id)
              }}
            >
              {/* Avatar */}
              <div
                className="
                  w-12 h-12 rounded-lg
                  bg-blue-50 text-blue-600
                  flex items-center justify-center
                  font-semibold text-sm
                "
              >
                {getInitials(p.name)}
              </div>

              {/* Info */}
              <div>
                <div className="font-medium text-sm text-gray-800">
                  {p.name}
                </div>
                <div className="text-xs text-gray-500">
                  Giá:{" "}
                  <span className="font-semibold">
                    {p.price.toLocaleString()} VND
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(p.id)
                }}
                className="
                  text-xs text-yellow-700
                  hover:underline
                "
              >
                Sửa
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(p.id)
                }}
                className="
                  text-xs text-red-600
                  hover:underline
                "
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
