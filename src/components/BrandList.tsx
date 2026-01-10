import type { Category } from "../types/category"

type Props = {
    categories: Category[]
    onSelect: (id: number) => void
    onChangeStatus: (id: number, active: boolean) => void
    onAdd: () => void
}

export default function BrandList({ categories, onSelect, onChangeStatus, onAdd }: Props) {
    return (
        <div>
            <div className="flex items-center p-2 justify-between gap-4">
                <div />
                <div className="flex items-center gap-2">
                    <button
                        onClick={onAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow text-sm"
                    >
                        + Thêm mới
                    </button>
                </div>
            </div>
            <div className="p-5">
                {categories?.length === 0 ? (
                    <div className="text-gray-500">Không có brand nào</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                                        ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories?.map(cat => (
                                    <tr
                                        key={cat.id}
                                        onClick={() => onSelect(cat.id)}
                                        className="hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        {/* ID */}
                                        <td className="px-4 py-3 text-sm text-gray-700 border-b">
                                            {cat.id}
                                        </td>

                                        {/* Name */}
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                                            {cat.name}
                                        </td>

                                        {/* Status */}
                                        <td
                                            className="px-4 py-3 text-sm border-b"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={cat.active}
                                                    onChange={() => onChangeStatus(cat.id, !cat.active)}
                                                />
                                                <div className="
                                          relative w-11 h-6 bg-gray-200 rounded-full peer
                                          peer-checked:bg-green-500
                                          after:content-['']
                                          after:absolute after:top-[2px] after:left-[2px]
                                          after:bg-white after:border after:rounded-full
                                          after:h-5 after:w-5 after:transition-all
                                          peer-checked:after:translate-x-full
                                        "></div>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}