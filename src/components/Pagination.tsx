type PaginationProps = {
    page: number
    totalPages: number
    onChange: (page: number) => void
}

export default function Pagination({
                                       page,
                                       totalPages,
                                       onChange,
                                   }: PaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex justify-end items-center gap-2 mt-0">
            {/* PREV */}
            <button
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
                className={`px-3 py-1 rounded text-sm
          ${
                    page === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
                Prev
            </button>

            {/* PAGE NUMBERS */}
            {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1
                return (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        className={`px-3 py-1 rounded text-sm
              ${
                            p === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        {p}
                    </button>
                )
            })}

            {/* NEXT */}
            <button
                disabled={page === totalPages}
                onClick={() => onChange(page + 1)}
                className={`px-3 py-1 rounded text-sm
          ${
                    page === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
                Next
            </button>
        </div>
    )
}
