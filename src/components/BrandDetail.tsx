import { useState, useEffect } from "react"
import type { Brand } from "../types/brand"
import { useBrands } from "../hooks/useBrands"
import toast from "react-hot-toast"

type Props = {
  brand?: Brand | null
  brands: Brand[]
  onBack: () => void
  onDelete?: (id: number) => void
  isCreating?: boolean
  onRefresh: () => Promise<void>
}

export default function BrandDetail({
                                      brand,
                                      brands,
                                      onBack,
                                      onDelete,
                                      isCreating = false,
                                      onRefresh,
                                    }: Props) {
  const { createBrand, updateBrandName } = useBrands()

  const [isEditing, setIsEditing] = useState(isCreating)
  const [editedName, setEditedName] = useState(isCreating ? "" : brand?.name || "")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDisabled = !editedName.trim() || isSubmitting || !!error

  useEffect(() => {
    if (brand && !isCreating) {
      setEditedName(brand.name)
    }
  }, [brand, isCreating])

  const isDuplicateName = (name: string) => {
    const normalized = name.trim().toLowerCase()

    return brands.some(b => {
      if (!isCreating && b.id === brand?.id) return false
      return b.name.trim().toLowerCase() === normalized
    })
  }

  const handleEdit = () => {
    if (brand) {
      setEditedName(brand.name)
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (isSubmitting) return

    const loadingToast = toast.loading(
        isCreating ? "Đang tạo brand..." : "Đang cập nhật brand..."
    )
    setIsSubmitting(true)

    try {
      if (isCreating) {
        const receipt = await createBrand(editedName.trim())

        if (receipt?.status === 1) {
          await onRefresh()
          toast.success("✅ Tạo brand thành công!")
          onBack()
        } else {
          toast.error("❌ Transaction failed")
        }
        return
      }

      if (brand) {
        const receipt = await updateBrandName(brand.id, editedName.trim())

        if (receipt?.status === 1) {
          await onRefresh()
          toast.success("✅ Cập nhật brand thành công!")
          setIsEditing(false)
        } else {
          toast.error("❌ Transaction failed")
        }
      }
    } catch (err) {
      console.error(err)
      toast.error("❌ Xảy ra lỗi!")
    } finally {
      toast.dismiss(loadingToast)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (isCreating) onBack()
    else {
      setIsEditing(false)
      setEditedName(brand?.name || "")
    }
  }

  const handleDelete = () => {
    if (brand && onDelete) {
      if (confirm(`Bạn có chắc muốn xóa brand "${brand.name}"?`)) {
        onDelete(brand.id)
        onBack()
      }
    }
  }

  if (!brand && !isCreating) {
    return (
        <div className="p-5 text-center text-gray-500">
          📦 Chọn một brand để xem chi tiết
        </div>
    )
  }

  return (
      <div className="p-5">
        <div className="flex justify-between mb-4">
          <button onClick={onBack} className="text-sm text-gray-600">
            ← Quay lại
          </button>

          {!isEditing && brand && (
              <div className="flex gap-2">
                <button
                    onClick={handleEdit}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"
                >
                  ✏️ Sửa
                </button>
                {onDelete && (
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm"
                    >
                      🗑️ Xóa
                    </button>
                )}
              </div>
          )}
        </div>

        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b font-semibold">
            {isCreating ? "Thêm brand mới" : "Thông tin brand"}
          </div>

          <div className="p-4 space-y-3">
            {!isCreating && (
                <div className="flex justify-between">
                  <span>ID</span>
                  <span>#{brand?.id}</span>
                </div>
            )}

            <div className="flex justify-between items-center">
              <span>Tên Brand</span>
              {(isEditing || isCreating) ? (
                  <input
                      value={editedName}
                      onChange={(e) => {
                        const value = e.target.value
                        setEditedName(value)

                        if (!value.trim()) setError("Tên brand không được để trống")
                        else if (isDuplicateName(value)) setError("Tên brand đã tồn tại")
                        else setError(null)
                      }}
                      className="border rounded px-3 py-2 ml-4 flex-1"
                      autoFocus
                  />
              ) : (
                  <span className="font-medium">{brand?.name}</span>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {(isEditing || isCreating) && (
                <div className="flex gap-2 pt-3">
                  <button
                      onClick={handleSave}
                      disabled={isDisabled}
                      className={`flex-1 py-2 rounded-lg ${
                          isDisabled
                              ? "bg-gray-300"
                              : "bg-green-600 text-white"
                      }`}
                  >
                    {isCreating ? "Tạo mới" : "Lưu"}
                  </button>
                  <button
                      onClick={handleCancel}
                      className="flex-1 py-2 bg-gray-600 text-white rounded-lg"
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
