
// export default App
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'
import { shortenAddr } from './lib/utils';
import { ABI, CONTRACT_ADDRESS } from './contracts/contractData';
import { ExternalLink } from 'lucide-react';
import { BrowserProvider, Contract, formatEther, formatUnits, parseEther } from 'ethers';
import { useEffect, useState } from 'react';
import TransactionDetail from './components/TransactionDetail';
import TransactionList from './components/TransactionList';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import TransferProduct from './components/TransferProduct';
import ScannedPage from './components/ScannedPage';
import { getProductsFromChain } from './contracts/contractInteraction'

type Product = {
  id: string
  name: string
  price: number
  description?: string
  image?: string
  owner?: string
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

// 1. Get projectId
const projectId = import.meta.env.VITE_WALLETCONNECT_ID;
// 2. Set chains
const sepolia = {
  chainId: 11155111,
  name: 'Ethereum Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: import.meta.env.VITE_ETH_SEPOLIA_RPC_URL
}
// 3. Create a metadata object
const metadata = {
  name: "Crowdfunding Interface",
  description: "My Website helpe user using Crowdfunding contract",
  url: 'https://mywebsite.com', // origin must match your domain & subdomai
  icons: ['https://avatars.mywebsite.com/']
}
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,
  // /+Optional</
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  // enableCoinbase: true, // true by default
  // rpcUrl: '', // used for the Coinbase SDK
  // defaultChainId: 1 // used for the Coinbase SDK
})
// 5. Create a AppKit instance
createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableAnalytics: true // false by default
})
function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider()
  const [crowdfundingBal, setCrowdfundingBal] = useState<string | null>(null);
  const [funderLenght, setFunderLenght] = useState<number | null>(null);
  const [amoutFund, setAmoutFund] = useState<number | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false)

  console.log(amoutFund)

  const fetchContractData = async () => {
    console.log("════════ fetchContractData ════════");

    if (!walletProvider) return;

    try {
      setLoadingProducts(true); // ✅ START LOADING

      const ethersProvider = new BrowserProvider(walletProvider);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, ethersProvider);

      // ===== PRODUCTS =====
      console.log("⛓ Fetching products from chain...");
      const chainProducts = await getProductsFromChain();

      console.log("📦 chainProducts =", chainProducts);

      if (Array.isArray(chainProducts)) {
        const mapped = chainProducts.map((p: any) => ({
          id: p.id?.toString() ?? "",
          name: p.name ?? "",
          price: Number(p.price ?? 0),
          description: p.description ?? "",
          ingredients: p.ingredients ?? "",
          manufactureDate: p.manufactureDate ? Number(p.manufactureDate) : undefined,
          expiryDate: p.expiryDate ? Number(p.expiryDate) : undefined,
        }));

        setProducts(mapped);
      }

    } catch (err) {
      console.error("❌ fetchContractData error", err);
    } finally {
      setLoadingProducts(false); // ✅ END LOADING
    }
  };


  const handleFundToCrowdfunding = async () => {
    if (amoutFund === null || amoutFund <= 0) {
      alert("Amount Funding Invalid");
    }
    if (walletProvider) {
      const ethersProvider = new BrowserProvider(walletProvider);
      const singer = await ethersProvider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, singer);
      const tx = contract.fund({ value: parseEther(String(amoutFund)) });
      console.log("tx: ", tx);

    }

  }
  const onInputAmoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmoutFund(Number(e.target.value))
  }
  useEffect(() => {
    fetchContractData();
  }, [walletProvider])

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const selectedProduct = products.find(p => p.id === selectedProductId) ?? null
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const selectedTransaction = transactions.find(t => t.id === selectedTransactionId) ?? null
  const [menu, setMenu] = useState<'products' | 'transactions' | 'analytics' | 'transfer'>('products')
  const [scannedData, setScannedData] = useState<any | null>(null)
  // ===== Dashboard computed counts =====
  const totalProducts = products.length
  const nowSec = Math.floor(Date.now() / 1000)
  const expiredCount = products.filter(p => (p as any).expiryDate && (p as any).expiryDate > 0 && (p as any).expiryDate < nowSec).length
  // status: 0 = Đang lưu hành, 1 = Đã bán (assumption), other = Ngừng bán
  const inCirculationCount = products.filter(p => (p as any).status === 0).length
  const soldCount = products.filter(p => (p as any).status === 1).length
  // Product handlers
  const handleAddProduct = () => {
    setIsAddingProduct(true)
    setEditingProductId(null)
    setSelectedProductId(null)
  }
  const handleSaveProduct = (data: { id?: string; name: string; price: number; description?: string; image?: string }) => {
    if (data.id) {
      setProducts(prev => prev.map(p => (p.id === data.id ? { ...p, name: data.name, price: data.price, description: data.description, image: data.image } : p)))
      setEditingProductId(null)
      setSelectedProductId(data.id)
    } else {
      const id = 'p' + Date.now()
      const newP: Product = { id, name: data.name, price: data.price, description: data.description, image: data.image }
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
              <div className='flex items-center gap-2'>
                <a className='flex items-center gap-1 text-sm hover:bg-gray-200 p-1 rounded-lg' href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                  target="_blank">
                  {shortenAddr(CONTRACT_ADDRESS)}
                  <ExternalLink className='w-3 h-3' />
                </a>
              </div>
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
                <button onClick={() => setMenu('transfer')} className={`w-full text-left px-3 py-2 rounded ${menu === 'transfer' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>Transfer Product</button>
              </li>
              <li>
                <button onClick={() => setMenu('analytics')} className={`w-full text-left px-3 py-2 rounded ${menu === 'analytics' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>Analytics</button>
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
          <header className='container mx-auto py-2 px-2 border-b'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <div>
                  <h2 className="text-2xl font-bold">Dashboard</h2>
                  <div className="text-sm text-gray-500">Tổng quan sản phẩm</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="bg-slate-900 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                  onClick={() => open()}>
                  {isConnected ? `${shortenAddr(address)}` : "Connect Wallet"}
                </button>

                <button
                  className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-500 text-sm"
                  onClick={() => {
                    const demo = selectedProduct ?? product ?? { id: 'demo', name: 'Demo Product', price: 123000 }
                    setScannedData(demo as any)
                    setMenu('analytics')
                  }}
                >
                  Show QR (dev)
                </button>
              </div>
            </div>

          </header >
          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Tổng sản phẩm</div>
              <div className="text-xl font-bold">{totalProducts}</div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Đang lưu thông</div>
              <div className="text-xl font-bold">{inCirculationCount}</div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Đã bán</div>
              <div className="text-xl font-bold">{soldCount}</div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Hết hạn</div>
              <div className="text-xl font-bold text-red-600">{expiredCount}</div>
            </div>
          </div>
          {/* Content area: render by menu selection */}
          {menu === 'products' && (
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-260px)]">
              <div className="col-span-2 bg-white rounded shadow overflow-auto">
                <ProductList
                  products={products}
                  loading={loadingProducts}
                  onSelect={id => {
                    setSelectedProductId(id);
                    setEditingProductId(null);
                    setIsAddingProduct(false);
                  }}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
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
                  <ProductDetail
                    product={selectedProduct}
                    role={((): 'manufacturer' | 'owner' | 'consumer' | 'viewer' => {
                      if (!address) return 'viewer'
                      if (selectedProduct && (selectedProduct as any).owner && address && address.toLowerCase() === (selectedProduct as any).owner.toLowerCase()) return 'owner'
                      return 'consumer'
                    })()}
                    onAction={(a) => {
                      console.log('Product action', a)
                      if (a === 'verify') {
                        setScannedData(selectedProduct)
                        setMenu('analytics')
                      }
                      if (a === 'transfer') {
                        // TODO: open transfer UI
                        alert('Open transfer flow (TODO)')
                      }
                    }}
                    onScanClick={(p) => {
                      setScannedData(p)
                      setMenu('analytics')
                    }}
                    onBack={() => setSelectedProductId(null)}
                    onEdit={id => handleEditProduct(id)}
                    onDelete={id => handleDeleteProduct(id)}
                  />
                )}
              </div>
            </div>
          )}

          {menu === 'transactions' && (
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-260px)]">
              <div className="col-span-2 bg-white rounded shadow overflow-auto">
                <TransactionList transactions={transactions} onSelect={handleSelectTransaction} onDelete={handleDeleteTransaction} />
              </div>
              <div className="col-span-1 bg-white rounded shadow overflow-auto">
                <TransactionDetail transaction={selectedTransaction} onBack={() => setSelectedTransactionId(null)} />
              </div>
            </div>
          )}

          {menu === 'transfer' && (
            <div className="bg-white rounded shadow p-4 min-h-[calc(100vh-260px)]">
              <TransferProduct products={products.map(p => ({ id: p.id, name: p.name }))} onTransfer={(payload) => {
                // update owner locally
                setProducts(prev => prev.map(p => p.id === payload.productId ? { ...p, owner: payload.newOwner } : p))
                alert('Đã chuyển sản phẩm thành công (local)')
                setMenu('products')
                setSelectedProductId(payload.productId)
              }} onBack={() => setMenu('products')} />
            </div>
          )}

          {menu === 'analytics' && (
            <div className="bg-gray-50 min-h-[calc(100vh-260px)]">
              {scannedData ? <ScannedPage product={scannedData} /> : (
                <div className="p-6">
                  <h3 className="text-lg font-semibold">Analytics</h3>
                  <div className="text-sm text-gray-500 mt-2">Chưa có dữ liệu quét — nhấn "Show QR (dev)" hoặc click mã QR của sản phẩm.</div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default App;
const product = {
  id: 1,
  name: "test",
  price: 11222,
  description: "1",
  ingredients: "test",
  manufactureDate: 1767225600,
  expiryDate: 1768262400,
  createdAt: 1767446796,
  owner: "0x03ea79Ea20e58e2dFDa89dCaabddB58898588FaC",
  status: 0,
  imageUrl: "" // sau này gắn
}

