import { useState, useMemo, useEffect } from "react"
import type { Brand } from "../types/brand"
import Pagination from "./Pagination"

type Props = {
    brands: Brand[]
    onSelect: (id: number) => void
    onChangeStatus: (id: number, active: boolean) => void
    onAdd: () => void
}

export default function BrandList({
                                      brands,
                                      onSelect,
                                      onChangeStatus,
                                      onAdd,
                                  }: Props) {
    const [page, setPage] = useState(1)
    const pageSize = 10

    const totalPages = Math.ceil(brands.length / pageSize)

    const pagedBrands = useMemo(() => {
        const start = (page - 1) * pageSize
        return [...brands]
            .sort((a, b) => b.id - a.id)
            .slice(start, start + pageSize)
    }, [brands, page])

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages || 1)
        }
    }, [brands.length, totalPages])

    return (
        <div>
            <div className="flex justify-end p-2">
                <button
                    onClick={onAdd}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                    + Thêm mới
                </button>
            </div>

            <div className="p-2">
                {pagedBrands.length === 0 ? (
                    <div className="text-gray-500">Không có brand nào</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border rounded-lg">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pagedBrands.map(brand => (
                                <tr
                                    key={brand.id}
                                    onClick={() => onSelect(brand.id)}
                                    className="hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="px-4 py-3">{brand.id}</td>
                                    <td className="px-4 py-3 font-medium">{brand.name}</td>
                                    <td
                                        className="px-4 py-3"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={brand.active}
                                                onChange={() =>
                                                    onChangeStatus(brand.id, !brand.active)
                                                }
                                            />
                                            <div className="
                            relative w-11 h-6 bg-gray-200 rounded-full peer
                            peer-checked:bg-green-500
                            after:content-['']
                            after:absolute after:top-[2px] after:left-[2px]
                            after:bg-white after:border after:rounded-full
                            after:h-5 after:w-5 after:transition-all
                            peer-checked:after:translate-x-full
                          "/>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="px-5 pb-4">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onChange={setPage}
                    />
                </div>
            )}
        </div>
    )
}
