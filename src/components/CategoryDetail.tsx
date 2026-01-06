
type Transaction = {
  id: string
  title: string
  amount: number
  date: string
  description?: string
}

type Props = {
  transaction?: Transaction | null
  onBack: () => void
}

export default function TransactionDetail({ transaction, onBack }: Props) {
  if (!transaction) return (
    <div className="p-4">
      <button onClick={onBack} className="text-sm text-gray-600 mb-2">← Quay lại</button>
      <div className="text-gray-500">Chưa chọn giao dịch</div>
    </div>
  )

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button onClick={onBack} className="text-sm text-gray-600 mr-2">← Quay lại</button>
          <h2 className="text-lg font-semibold inline">Chi tiết giao dịch</h2>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-lg font-medium">{transaction.title}</div>
        <div className="text-sm text-gray-500">{transaction.date}</div>
        <div className="mt-3 text-gray-700">Số tiền: <span className="font-semibold">{transaction.amount.toLocaleString()} VND</span></div>
        {transaction.description && <div className="mt-3 text-gray-600">{transaction.description}</div>}
      </div>
    </div>
  )
}
