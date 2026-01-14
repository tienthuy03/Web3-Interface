import { useState, useEffect } from "react"
import type { Category } from "../types/category"
import { useCategories } from "../hooks/useCategories"
import toast from "react-hot-toast";

type Props = {
  category?: Category | null
  categories: Category[]
  onBack: () => void
  onSave?: (category: Category) => void
  onDelete?: (id: number) => void
  isCreating?: boolean
  onCreate?: (category: Omit<Category, 'id'>) => void
  onRefresh: () => Promise<void>
}

export default function CategoryDetail({
  category,
  categories,
  onBack,
  onSave,
  onDelete,
  isCreating = false,
  onRefresh
}: Props) {
  const {
    createCategory,
    updateCategoryName,
  } = useCategories()

  const [isEditing, setIsEditing] = useState(isCreating)
  const [editedName, setEditedName] = useState(isCreating ? "" : (category?.name || ""))
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDisabled = !editedName.trim() || isSubmitting || !!error

  useEffect(() => {
    if (category && !isCreating) {
      setEditedName(category.name)
    }
  }, [category, isCreating])

  const isDuplicateName = (name: string) => {
    const normalized = name.trim().toLowerCase()

    return categories.some(cat => {
      if (!isCreating && cat.id === category?.id) return false

      return cat.name.trim().toLowerCase() === normalized
    })
  }

  const handleEdit = () => {
    if (category) {
      setEditedName(category.name)
      setIsEditing(true)
    }
  }

  const handleSave = async  () => {
    if (isSubmitting) return

    const loadingToast = toast.loading(isCreating ? 'Đang tạo category...' : 'Đang cập nhật category...')
    setIsSubmitting(true)

    try {
        // CREATE
        if (isCreating) {
          const receipt = await createCategory(editedName.trim())

          if (receipt?.status === 1) {
            await onRefresh()
            toast.success("✅ Tạo category thành công!")
            setEditedName("")
            onBack()
          } else {
            toast.error("❌ Transaction failed")
          }

          toast.dismiss(loadingToast)
          return
        }

        // UPDATE
        if (category) {
          const receipt = await updateCategoryName(category.id, editedName.trim())

          if (receipt?.status === 1) {
            await onRefresh()
            toast.success("✅ Cập nhật category thành công!")
            setIsEditing(false)
          } else {
            toast.error("❌ Transaction failed")
          }

          toast.dismiss(loadingToast)
          return
        }
      } catch (err) {
        console.error("❌ handleSave error:", err)
        toast.dismiss(loadingToast)
        toast.success('❌ Xảy ra lỗi!')
      } finally {
        toast.dismiss(loadingToast)
        setIsSubmitting(false)
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
      if (confirm(`Bạn có chắc muốn xóa category "${category.name}"?`)) {
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
            <div className="text-gray-500">Chọn một category để xem chi tiết</div>
          </div>
        </div>
      </div>
    )
  }

  const title = isCreating ? "Thêm Category mới" : "Chi tiết Category"

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
            {isCreating ? "Thông tin category mới" : "Thông tin chi tiết"}
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
                onChange={(e) => {
                  const value = e.target.value
                  setEditedName(value)

                  if (!value.trim()) {
                    setError("Tên category không được để trống")
                    return
                  } else if (isDuplicateName(value)) {
                    setError("Tên category đã tồn tại")
                    return
                  } else {
                    setError(null)
                  }
                }}
                className={`text-sm font-medium bg-white rounded px-3 py-2 flex-1 ml-4 focus:ring-2 focus:ring-blue-500 focus:outline-none
                  ${error ? "border-red-500" : "border-blue-400"}
                `}
                placeholder="Nhập tên category"
                autoFocus
              />
            ) : (
              <span className="text-sm font-medium text-gray-900">{category?.name}</span>
            )}
          </div>
          {error && (
              <p className="text-sm text-red-500 mt-1 ml-24">
                {error}
              </p>
          )}

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
                disabled={isDisabled}
                className={`flex-1 px-4 py-2 rounded-lg transition text-sm font-medium 
                ${!isDisabled
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