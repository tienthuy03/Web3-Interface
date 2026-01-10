import { useState, useEffect } from "react"
import type { Category } from "../types/category"

type Props = {
  category?: Category | null
  onBack: () => void
  onSave?: (category: Category) => void
  onDelete?: (id: number) => void
  isCreating?: boolean
  onCreate?: (category: Omit<Category, 'id'>) => void
}

export default function BrandDetail({
  category,
  onBack,
  onSave,
  onDelete,
  isCreating = false,
  onCreate
}: Props) {
  const [isEditing, setIsEditing] = useState(isCreating)
  const [editedName, setEditedName] = useState(isCreating ? "" : (category?.name || ""))

  useEffect(() => {
    if (category && !isCreating) {
      setEditedName(category.name)
    }
  }, [category, isCreating])

  const handleEdit = () => {
    if (category) {
      setEditedName(category.name)
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    if (isCreating && onCreate && editedName.trim()) {
      onCreate({
        name: editedName.trim(),
        active: true
      })
      setEditedName("")
      setIsEditing(false)
      onBack()
    } else if (category && onSave && editedName.trim()) {
      onSave({
        ...category,
        name: editedName.trim()
      })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    if (isCreating) {
      onBack()
    } else {
      setIsEditing(false)
      setEditedName(category?.name || "")
    }
  }

  const handleDelete = () => {
    if (category && onDelete) {
      if (confirm(`Bạn có chắc muốn xóa brand "${category.name}"?`)) {
        onDelete(category.id)
        onBack()
      }
    }
  }

  if (!category && !isCreating) {
    return (
      <div className="p-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 text-5xl mb-3">📁</div>
            <div className="text-gray-500">Chọn một brand để xem chi tiết</div>
          </div>
        </div>
      </div>
    )
  }

  const title = isCreating ? "Thêm brand mới" : "Chi tiết Brand"

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Quay lại
          </button>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        {!isEditing && category && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ✏️ Sửa
            </button>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                🗑️ Xóa
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">
            {isCreating ? "Thông tin brand mới" : "Thông tin chi tiết"}
          </h4>
        </div>

        <div className="p-4 space-y-3">
          {!isCreating && (
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">ID Category</span>
              <span className="text-sm font-medium text-gray-900">#{category?.id}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Tên Category</span>
            {isEditing || isCreating ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-sm font-medium text-gray-900 bg-white border border-blue-400 rounded px-3 py-2 flex-1 ml-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên category"
                autoFocus
              />
            ) : (
              <span className="text-sm font-medium text-gray-900">{category?.name}</span>
            )}
          </div>

          {!isCreating && category && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Trạng thái</span>
              <span className="text-sm font-medium">
                {category.active ? (
                  <span className="text-green-600">✓ Đang hoạt động</span>
                ) : (
                  <span className="text-gray-600">○ Tạm dừng</span>
                )}
              </span>
            </div>
          )}

          {(isEditing || isCreating) && (
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={!editedName.trim()}
                className={`flex-1 px-4 py-2 rounded-lg transition text-sm font-medium ${editedName.trim()
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {isCreating ? "Tạo mới" : "Lưu"}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}