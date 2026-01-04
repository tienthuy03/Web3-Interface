
type Transaction = {
  id: string
  title: string
  amount: number
  date: string
}

type Props = {
  transactions: Transaction[]
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
}

export default function TransactionList({ transactions, onSelect, onDelete }: Props) {
  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold mb-2">Lịch sử giao dịch</h2>
      <div className="text-xs text-gray-500 mb-3">Giao dịch gần đây</div>

      <div className="space-y-3">
        {transactions.length === 0 && <div className="text-gray-500">Không có giao dịch</div>}
        {transactions.map(t => (
          <div key={t.id} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:shadow-md transition-shadow bg-white">
            <div className="cursor-pointer" onClick={() => onSelect(t.id)}>
              <div className="font-medium text-sm">{t.title}</div>
              <div className="text-xs text-gray-500">{t.date} • <span className="font-semibold">{t.amount.toLocaleString()} VND</span></div>
            </div>
            {onDelete && <button onClick={() => onDelete(t.id)} className="text-xs text-red-600 hover:underline">Xóa</button>}
          </div>
        ))}
      </div>
    </div>
  )
}
