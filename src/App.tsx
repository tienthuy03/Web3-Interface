import React, { useState } from 'react'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import ProductForm from './components/ProductForm'
import TransactionList from './components/TransactionList'
import TransactionDetail from './components/TransactionDetail'

type Product = {
  id: string
  name: string
  price: number
  description?: string
}

const sampleProducts: Product[] = [
  { id: 'p1', name: 'Áo thun', price: 150000, description: 'Áo thun cotton thoáng mát' },
  { id: 'p2', name: 'Quần jeans', price: 350000, description: 'Quần jeans xanh' },
]

type Transaction = {
  id: string
  title: string
  amount: number
  date: string
  description?: string
}

const sampleTransactions: Transaction[] = [
  { id: 't1', title: 'Mua Áo thun', amount: 150000, date: '2025-12-20', description: 'Khách hàng A' },
  { id: 't2', title: 'Mua Quần jeans', amount: 350000, date: '2025-12-21', description: 'Khách hàng B' },
]

function App() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)

  const selectedProduct = products.find(p => p.id === selectedProductId) ?? null
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const selectedTransaction = transactions.find(t => t.id === selectedTransactionId) ?? null
  const [menu, setMenu] = useState<'products' | 'transactions'>('products')

  // Product handlers
  const handleAddProduct = () => {
    setIsAddingProduct(true)
    setEditingProductId(null)
    setSelectedProductId(null)
  }

  const handleSaveProduct = (data: { id?: string; name: string; price: number; description?: string }) => {
    if (data.id) {
      setProducts(prev => prev.map(p => (p.id === data.id ? { ...p, name: data.name, price: data.price, description: data.description } : p)))
      setEditingProductId(null)
      setSelectedProductId(data.id)
    } else {
      const id = 'p' + Date.now()
      const newP: Product = { id, name: data.name, price: data.price, description: data.description }
      setProducts(prev => [newP, ...prev])
      setIsAddingProduct(false)
      setSelectedProductId(id)
    }
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    if (selectedProductId === id) setSelectedProductId(null)
    if (editingProductId === id) setEditingProductId(null)
  }

  const handleEditProduct = (id: string) => {
    setEditingProductId(id)
    setIsAddingProduct(false)
    setSelectedProductId(null)
  }

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactionId(id)
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
    if (selectedTransactionId === id) setSelectedTransactionId(null)
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="h-full flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col">
          <div className="px-6 py-6 flex items-center gap-3 border-b">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">B</div>
            <div>
              <div className="font-semibold">Business</div>
              <div className="text-xs text-gray-500">Admin panel</div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <button onClick={() => setMenu('products')} className={`w-full text-left px-3 py-2 rounded ${menu === 'products' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>Products</button>
              </li>
              <li>
                <button onClick={() => setMenu('transactions')} className={`w-full text-left px-3 py-2 rounded ${menu === 'transactions' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>Transactions</button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Analytics</button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Messages</button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Customers</button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t">
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Settings</button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <div className="text-sm text-gray-500">Tổng quan sản phẩm</div>
            </div>
            <div className="flex items-center gap-3">
              <input placeholder="Tìm kiếm..." className="border rounded px-3 py-2" />
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
            </div>
          </header>

          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Sản phẩm</div>
              <div className="text-xl font-bold">{products.length}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Doanh thu</div>
              <div className="text-xl font-bold">{products.reduce((s, p) => s + p.price, 0).toLocaleString()} VND</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Đơn hàng</div>
              <div className="text-xl font-bold">201</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Khách hàng</div>
              <div className="text-xl font-bold">1,201</div>
            </div>
          </div>

          {/* Content area: render by menu selection */}
          {menu === 'products' ? (
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-260px)]">
              <div className="col-span-2 bg-white rounded shadow overflow-auto">
                <ProductList
                  products={products}
                  onSelect={id => { setSelectedProductId(id); setEditingProductId(null); setIsAddingProduct(false) }}
                  onEdit={id => handleEditProduct(id)}
                  onDelete={id => handleDeleteProduct(id)}
                  onAdd={handleAddProduct}
                />
              </div>

              <div className="col-span-1 bg-white rounded shadow overflow-auto">
                {isAddingProduct && (
                  <div>
                    <h3 className="px-4 pt-4 text-lg font-semibold">Thêm sản phẩm</h3>
                    <ProductForm onSave={handleSaveProduct} onCancel={() => setIsAddingProduct(false)} />
                  </div>
                )}

                {editingProductId && (
                  <div>
                    <h3 className="px-4 pt-4 text-lg font-semibold">Sửa sản phẩm</h3>
                    <ProductForm initial={products.find(p => p.id === editingProductId) ?? {}} onSave={handleSaveProduct} onCancel={() => setEditingProductId(null)} />
                  </div>
                )}

                {!isAddingProduct && !editingProductId && (
                  <ProductDetail product={selectedProduct} onBack={() => setSelectedProductId(null)} onEdit={id => handleEditProduct(id)} onDelete={id => handleDeleteProduct(id)} />
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-260px)]">
              <div className="col-span-2 bg-white rounded shadow overflow-auto">
                <TransactionList transactions={transactions} onSelect={handleSelectTransaction} onDelete={handleDeleteTransaction} />
              </div>
              <div className="col-span-1 bg-white rounded shadow overflow-auto">
                <TransactionDetail transaction={selectedTransaction} onBack={() => setSelectedTransactionId(null)} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
// import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
// // 1. Get projectId
// const projectId = import.meta.env.VITE_WALLETCONNECT_ID;
// // 2. Set chains
// const sepolia = {
//   chainId: 1,
//   name: 'Ethereum',
//   currency: 'ETH',
//   explorerUrl: 'https://etherscan.io',
//   rpcUrl: 'https://cloudflare-eth.com'
// }
// // 3. Create a metadata object
// const metadata = {
//   name: 'My Website',
//   description: 'My Website description',
//   url: 'https://mywebsite.com', // origin must match your domain & subdomai
//   icons: ['https://avatars.mywebsite.com/']
// }
// // 4. Create Ethers config
// const ethersConfig = defaultConfig({
//   /*Required*/
//   metadata,
//   // /+Optional</
//   enableEIP6963: true, // true by default
//   enableInjected: true, // true by default
//   enableCoinbase: true, // true by default
//   rpcUrl: '', // used for the Coinbase SDK
//   defaultChainId: 1 // used for the Coinbase SDK
// })
// // 5. Create a AppKit instance
// createWeb3Modal({
//   ethersConfig,
//   chains: [mainnet],
//   projectId,
//   enableAnalytics: true // false by default
// })
// function App() {
//   return (
//     <div>
//       <button className="bg-slate-900 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">
//         Connect Wallet
//       </button>
//     </div>
//   );
// }
// export default App;