
// export default App
import { useLocation } from 'react-router-dom'
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
import { getProductsFromChain, getProductFromChain } from './contracts/contractInteraction'
import TransferDelivery from './components/TransferDelivery';

type Product = {
  id: string
  name: string
  price: number
  description?: string
  image?: string
  owner?: string
  category?: string
  brand?: string
  currency?: string
}

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
  const location = useLocation()
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider()

  // If on product page route, show ScannedPage directly (for QR code scanning)
  if (location.pathname.startsWith('/products/') || location.pathname.startsWith('/product/')) {
    // Extract product ID from URL (if any)
    const pathMatch = location.pathname.match(/\/(?:products?|product)\/(.+)$/)
    const productId = pathMatch ? pathMatch[1] : '1'


    return <ScannedPage product={product} />
  }
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  console.log("98 selectedProductDetail: ", selectedProductDetail);

  const fetchContractData = async () => {
    console.log("════════ fetchContractData ════════");

    if (!walletProvider) {
      console.log("❌ walletProvider NOT FOUND");
      return;
    }

    try {
      setLoadingProducts(true);

      console.log("✅ walletProvider OK");

      const ethersProvider = new BrowserProvider(walletProvider);
      console.log("✅ ethersProvider OK");

      const contract = new Contract(CONTRACT_ADDRESS, ABI, ethersProvider);
      console.log("✅ contract OK");

      console.log("⛓ BEFORE getProductsFromChain");

      // Pass the ethersProvider to getProductsFromChain
      const chainProducts = await getProductsFromChain(ethersProvider);

      console.log("📦 AFTER getProductsFromChain");
      console.log("📦 chainProducts =", chainProducts);

      if (!Array.isArray(chainProducts)) {
        console.error("❌ chainProducts is NOT array", chainProducts);
        return;
      }

      const mapped = chainProducts.map((p: any, index: number) => {
        console.log(`🔹 product[${index}] raw =`, p);

        return {
          id: p.id?.toString() ?? index.toString(),
          name: p.name ?? "",
          price: Number(p.price ?? 0),
          description: p.description ?? "",
          ingredients: p.ingredients ?? "",
          manufactureDate: p.manufactureDate ? Number(p.manufactureDate) : undefined,
          expiryDate: p.expiryDate ? Number(p.expiryDate) : undefined,
          createdAt: p.createdAt ? Number(p.createdAt) : undefined,
          owner: p.owner ?? "",
          status: p.status !== undefined ? Number(p.status) : undefined,
          image: p.imageUrl ?? "", // Map imageUrl to image for ProductList component
          imageUrl: p.imageUrl ?? "",
          category: p.category ?? "",
          brand: p.brand ?? "",
          currency: p.currency ?? "VND",
          // Additional blockchain fields
          batchId: p.batchId ?? "",
          productCode: p.sku ?? "",
          origin: p.origin ?? "",
          certHash: p.certHash ?? "",
          txHash: p.txHash ?? "",
          metadataHash: p.metadataHash ?? "",
          documentUrl: p.documentUrl ?? "",
          verifyStatus: p.verifyStatus !== undefined ? Number(p.verifyStatus) : undefined,
          deleted: p.deleted !== undefined ? Number(p.deleted) : undefined,
        };
      });

      console.log("✅ mapped products =", mapped);
      setProducts(mapped);

    } catch (err) {
      console.error("❌ fetchContractData ERROR:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [walletProvider])

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const selectedProduct = products.find(p => p.id === selectedProductId) ?? null
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const selectedTransaction = transactions.find(t => t.id === selectedTransactionId) ?? null
  const [menu, setMenu] = useState<'products' | 'transactions' | 'analytics' | 'transfer' | 'transferDelivery'>('products')
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
    setIsAddingProduct(false)
    setEditingProductId(null)
    setSelectedProductId(null)
    setShowCreateModal(true)
  }
  const handleSaveProduct = async (data: { id?: string; name: string; price: number; description?: string; image?: string; category?: string; brand?: string; currency?: string }) => {
    if (data.id) {
      setProducts(prev => prev.map(p => (p.id === data.id ? { ...p, name: data.name, price: data.price, description: data.description, image: data.image, ...(data.category ? { category: data.category } : {}), ...(data.brand ? { brand: data.brand } : {}), ...(data.currency ? { currency: data.currency } : {}) } : p)))
      setEditingProductId(null)
      setSelectedProductId(data.id)
    } else {
      const id = 'p' + Date.now()
      const newP: Product = { id, name: data.name, price: data.price, description: data.description, image: data.image, ...(data.category ? { category: data.category } : {}), ...(data.brand ? { brand: data.brand } : {}), ...(data.currency ? { currency: data.currency } : {}) }
      setProducts(prev => [newP, ...prev])
      setIsAddingProduct(false)
      setSelectedProductId(id)
    }
    // close modals if open
    setShowEditModal(false)
    setShowCreateModal(false)
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
    setShowEditModal(true)
  }
  const handleSelectTransaction = (id: string) => {
    setSelectedTransactionId(id)
  }
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
    if (selectedTransactionId === id) setSelectedTransactionId(null)
  }

  const [loadingDetail, setLoadingDetail] = useState(false)

  const fetchProductDetail = async (productId: string) => {
    console.log("═════════ [START] fetchProductDetail ═════════");
    console.log("📋 Input productId:", productId);

    try {
      console.log("🔄 Setting loading to true...");
      setLoadingDetail(true);

      const productIdNum = Number(productId);
      console.log("🔢 Converted productId to number:", productIdNum);

      if (isNaN(productIdNum)) {
        console.error("❌ Invalid product ID - not a number");
        throw new Error("ID sản phẩm không hợp lệ");
      }

      console.log(`📡 Calling getProductFromChain(${productIdNum})...`);

      try {
        const productData = await getProductFromChain(productIdNum);
        console.log("✅ Contract call successful!");
        console.log("256 📦 Product data:", productData);
        console.log("📊 Product data type:", typeof productData);
        console.log("📊 Is productData truthy?", !!productData);

        if (productData) {
          console.log("✅ Product data exists, mapping...");

          // Debug thêm chi tiết
          console.log("=== DEBUG PRODUCT FIELDS ===");
          console.log("originCountry:", productData.originCountry);
          console.log("createdAt:", productData.createdAt);
          console.log("manufactureDate:", productData.manufactureDate);
          console.log("expiryDate:", productData.expiryDate);
          console.log("owner:", productData.owner);
          console.log("=== END DEBUG ===");

          // Tạo object đầy đủ cho UI
          const mappedProduct = {
            // Dữ liệu gốc từ contract
            ...productData,

            // Đảm bảo các field UI cần
            id: productData.id?.toString() || productId,
            image: productData.imageURI || "",
            imageUrl: productData.imageURI || "",
            imageURI: productData.imageURI || "",
            category: productData.category || "",
            brand: productData.brand || "",
            currency: productData.currency || "VND",
            batchNumber: productData.batchNumber || "",
            sku: productData.sku || "",
            originCountry: productData.originCountry || "",
            createdAt: productData.createdAt || 0,
            manufactureDate: productData.manufactureDate || 0,
            expiryDate: productData.expiryDate || 0,
            owner: productData.owner || "",
            // Thêm các field mặc định
            description: productData.description || "",
            ingredients: productData.ingredients || "",
            price: productData.price || 0,
            status: productData.status || 0,
            documentUrl: productData.documentURI || "",
            name: productData.name,
          };

          console.log("✅ Mapped product for UI:", mappedProduct);
          console.log("🔄 Setting selectedProductDetail...");
          setSelectedProductDetail(mappedProduct);
          console.log("🔄 Setting showDetail to true...");
          setShowDetail(true);
        } else {
          console.warn("⚠️ productData is null or undefined");
        }
      } catch (contractError) {
        console.error("❌ Error in getProductFromChain:", contractError);
        console.error("Contract error message:", contractError.message);
        throw contractError;
      }

    } catch (err) {
      console.error("❌ fetchProductDetail ERROR:", err);
      console.error("Error stack:", err.stack);
      console.error("Error name:", err.name);
      console.error("Error code:", err.code);

      // Fallback
      console.log("🔄 Trying fallback to local products...");
      const localProduct = products.find(p => p.id === productId);
      if (localProduct) {
        console.log("✅ Found local product:", localProduct);
        console.log("🔄 Setting selectedProductDetail from local...");
        setSelectedProductDetail(localProduct);
        console.log("🔄 Setting showDetail to true...");
        setShowDetail(true);
      } else {
        console.error("❌ No local product found for ID:", productId);
        alert("Lỗi: " + (err.message || "Không thể tải sản phẩm"));
      }
    } finally {
      console.log("🔄 Setting loading to false...");
      setLoadingDetail(false);
      console.log("═════════ [END] fetchProductDetail ═════════\n");
    }
  };
  // Hàm xử lý khi click vào sản phẩm trong danh sách
  const handleSelectProduct = async (id: string) => {
    setSelectedProductId(id);

    // Gọi contract để lấy chi tiết sản phẩm
    await fetchProductDetail(id);

    setEditingProductId(null);
    setIsAddingProduct(false);
  };
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
                <button onClick={() => setMenu('transferDelivery')} className={`w-full text-left px-3 py-2 rounded ${menu === 'transferDelivery' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>Transfer Delivery</button>
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
            <div className="h-[calc(100vh-260px)]">
              <div className="bg-white rounded shadow overflow-auto h-full">
                {/* <ProductList
                  products={products}
                  loading={loadingProducts}
                  onSelect={id => {
                    const product = products.find(p => p.id === id);
                    setSelectedProductId(id);
                    setSelectedProductDetail(product || null);
                    setShowDetail(true);
                    setEditingProductId(null);
                    setIsAddingProduct(false);
                  }}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onAdd={handleAddProduct}
                /> */}
                <ProductList
                  products={products}
                  loading={loadingProducts}
                  onSelect={handleSelectProduct} // Dùng hàm mới
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onAdd={handleAddProduct}
                />
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
          {menu === 'transferDelivery' && (
            <div className="bg-white rounded shadow p-4 min-h-[calc(100vh-260px)]">
              <TransferDelivery products={products.map(p => ({ id: p.id, name: p.name }))} onTransfer={(payload) => {
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

          {/* Global edit modal */}
          {showEditModal && editingProductId && (() => {
            const product = products.find(p => p.id === editingProductId)
            console.log("453 product: ", product);

            if (!product) return null
            return (
              <ProductForm
                initial={{
                  id: product.id,
                  sku: (product as any).productCode || (product as any).sku || '',
                  batchNumber: (product as any).batchId || (product as any).batchNumber || '',
                  category: product.category || '',
                  brand: product.brand || '',
                  originCountry: (product as any).origin || '',
                  name: product.name || '',
                  description: product.description || '',
                  ingredients: product.ingredients || '',
                  manufactureDate: product.manufactureDate ? (product.manufactureDate > 1e12 ? product.manufactureDate : product.manufactureDate * 1000) : undefined,
                  expiryDate: product.expiryDate ? (product.expiryDate > 1e12 ? product.expiryDate : product.expiryDate * 1000) : undefined,
                  price: product.price || 0,
                  currency: product.currency || 'VND',
                  imagePath: product.imageUrl || product.image || '',
                  documentPath: (product as any).documentUrl || ''
                }}
                onSave={handleSaveProduct}
                onCancel={() => { setShowEditModal(false); setEditingProductId(null) }}
                asModal
              />
            )
          })()}

          {/* Global create modal */}
          {showCreateModal && (
            <ProductForm
              initial={{}}
              onSave={handleSaveProduct}
              onCancel={() => setShowCreateModal(false)}
              asModal
            />
          )}
          {showDetail && selectedProductDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* overlay */}
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => {
                  setShowDetail(false)
                  setSelectedProductDetail(null)
                  setSelectedProductId(null)
                }}
              />

              {/* modal */}
              <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden z-10 flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <ProductDetail
                    product={selectedProductDetail}
                    role={((): 'manufacturer' | 'owner' | 'consumer' | 'viewer' => {
                      if (!address) return 'viewer'
                      if (selectedProductDetail && (selectedProductDetail as any).owner && address && address.toLowerCase() === (selectedProductDetail as any).owner.toLowerCase()) return 'owner'
                      return 'consumer'
                    })()}
                    onBack={() => {
                      setShowDetail(false)
                      setSelectedProductDetail(null)
                      setSelectedProductId(null)
                    }}
                    onEdit={(id) => {
                      setShowDetail(false)
                      handleEditProduct(id)
                    }}
                    onDelete={(id) => {
                      setShowDetail(false)
                      handleDeleteProduct(id)
                    }}
                    onAction={(a) => {
                      console.log('Product action', a)
                      if (a === 'verify') {
                        setScannedData(selectedProductDetail)
                        setShowDetail(false)
                        setMenu('analytics')
                      }
                      if (a === 'transfer') {
                        setShowDetail(false)
                        setMenu('transfer')
                      }
                    }}
                    onScanClick={(p) => {
                      setScannedData(p)
                      setShowDetail(false)
                      setMenu('analytics')
                    }}
                  />
                </div>
              </div>
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

