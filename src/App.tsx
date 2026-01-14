
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import './config/web3Config'; // Initialize Web3Modal
import { useProducts } from './hooks/useProducts';
import { useProductScanner } from './hooks/useProductScanner';
import { useCategories} from "./hooks/useCategories";
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import CategoryDetail from './components/CategoryDetail';
import CategoryList from './components/CategoryList';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import TransferProduct from './components/TransferProduct';
import ScannedPage from './components/ScannedPage';
import TransferDelivery from './components/TransferDelivery';
import type { Category } from './types/category';
import BrandList from './components/BrandList';
import BrandDetail from './components/BrandDetail';
import { useBrands } from "./hooks/useBrands"

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { address } = useWeb3ModalAccount();
  const { scannedProduct, loadingScan } = useProductScanner();
  const {
    products,
    loadingProducts,
    setProducts,
    fetchProductDetail,
  } = useProducts();

  const {
    brands,
    changeBrandStatus,
    fetchBrands
  } = useBrands()

  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null)
  const [isCreatingBrand, setIsCreatingBrand] = useState(false)

  const selectedBrand =
      brands?.find(b => b.id === selectedBrandId) ?? null

  const handleSelectBrand = (id: number) => {
    setSelectedBrandId(id)
  }

  const handleAddBrand = () => {
    setIsCreatingBrand(true)
    setSelectedBrandId(null)
  }

  const handleBackFromBrandDetail = () => {
    setIsCreatingBrand(false)
    setSelectedBrandId(null)
  }

  const { categories, changeCategoryStatus, fetchCategories} = useCategories();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [scannedData, setScannedData] = useState<any | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  // Xác định menu hiện tại từ URL
  const getCurrentMenu = (): 'products' | 'categories' | 'brands' | 'analytics' | 'transferProduct' | 'transferDelivery' => {
    const path = location.pathname;
    if (path.startsWith('/categories')) return 'categories';
    if (path.startsWith('/brands')) return 'brands';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/transfer-delivery')) return 'transferDelivery';
    if (path.startsWith('/transfer-product')) return 'transferProduct';
    if (path.startsWith('/products')) return 'products';
    return 'products';
  };

  const [menu, setMenu] = useState<'products' | 'categories' | 'brands' | 'analytics' | 'transferProduct' | 'transferDelivery'>(getCurrentMenu());

  // Redirect từ / sang /products
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/products', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Sync menu state với URL
  useEffect(() => {
    setMenu(getCurrentMenu());
  }, [location.pathname]);

  // Hàm thay đổi menu và update URL
  const handleMenuChange = (newMenu: 'products' | 'categories' | 'brands' | 'analytics' | 'transferProduct' | 'transferDelivery') => {
    setMenu(newMenu);
    const routes = {
      products: '/products',
      categories: '/categories',
      brands: '/brands',
      analytics: '/analytics',
      transferProduct: '/transfer-product',
      transferDelivery: '/transfer-delivery'
    };
    navigate(routes[newMenu]);
  };

  const selectedCategory = categories?.find(t => t.id === selectedCategoryId) ?? null;

  // Handle scanned product routes
  if (location.pathname.startsWith('/products/') || location.pathname.startsWith('/product/')) {
    if (loadingScan) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Đang truy xuất nguồn gốc từ Blockchain...</p>
        </div>
      );
    }

    if (!scannedProduct && !loadingScan) {
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <h2 className="text-red-500 font-bold text-xl">Lỗi truy xuất</h2>
            <p className="text-gray-600">Sản phẩm này không tồn tại trên hệ thống Blockchain.</p>
            <button onClick={() => window.location.href = '/'} className="mt-4 text-blue-600">Về trang chủ</button>
          </div>
        </div>
      );
    }

    return <ScannedPage product={scannedProduct} />;
  }

  // Product handlers
  const handleAddProduct = () => {
    setEditingProductId(null);
    setSelectedProductId(null);
    setShowCreateModal(true);
  };

  const handleSaveProduct = async (data: any) => {
    if (data.id) {
      setProducts(prev => prev.map(p => (
        p.id === data.id
          ? { ...p, ...data }
          : p
      )));
      setEditingProductId(null);
      setSelectedProductId(data.id);
    } else {
      const id = 'p' + Date.now();
      const newP = { id, ...data };
      setProducts(prev => [newP, ...prev]);
      setSelectedProductId(id);
    }
    setShowEditModal(false);
    setShowCreateModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (selectedProductId === id) setSelectedProductId(null);
    if (editingProductId === id) setEditingProductId(null);
  };

  const handleEditProduct = (id: string) => {
    setEditingProductId(id);
    setSelectedProductId(null);
    setShowEditModal(true);
  };

  const handleSelectProduct = async (id: string) => {
    setSelectedProductId(id);
    setEditingProductId(null);

    try {
      const productData = await fetchProductDetail(id);
      if (productData) {
        setSelectedProductDetail(productData);
        setShowDetail(true);
      }
    } catch (err) {
      alert("Lỗi: " + (err as Error).message);
    }
  };

  const handleSelectCategory = (id: number) => {
    const found = categories?.find(t => t.id === id);
    setSelectedCategoryId(id);
  };
  const handleAddCategory = () => {
    setIsCreatingCategory(true);
    setSelectedCategoryId(null);
  };

  const handleSaveCategory = (categoryData: Category | Omit<Category, 'id'>) => {
    if ('id' in categoryData) {
      console.log('Update category:', categoryData);
    } else {
      const newCategory = {
        ...categoryData,
        id: Date.now(),
      };
      console.log('Create new category:', newCategory);
      // TODO: Gọi API tạo category và cập nhật state
    }
    setIsCreatingCategory(false);
  };

  const handleBackFromCategoryDetail = () => {
    setIsCreatingCategory(false);
    setSelectedCategoryId(null);
  };

  return (
    <div className="h-screen bg-gray-50">
      <div className="h-full flex">
        <Sidebar activeMenu={menu} onMenuChange={handleMenuChange} />

        <main className="flex-1 overflow-auto p-6">
          <Header />
          <DashboardStats products={products} />
          {/* Menu content */}
          {menu === 'products' && (
            <div className="h-[calc(100vh-260px)]">
              <div className="bg-white rounded shadow overflow-auto h-full">
                <ProductList
                  products={products}
                  loading={loadingProducts}
                  onSelect={handleSelectProduct}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onAdd={handleAddProduct}
                />
              </div>
            </div>
          )}

          {menu === 'categories' && (
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-260px)]">
              <div className="col-span-2 bg-white rounded shadow overflow-hidden">
                <CategoryList
                  categories={categories}
                  onSelect={(id) => {
                    console.log('Selected category ID:', id);
                    handleSelectCategory(id);
                    setIsCreatingCategory(false);
                  }}
                  onChangeStatus={changeCategoryStatus}
                  onAdd={handleAddCategory}
                />
              </div>
              <div className="col-span-1 bg-white rounded shadow overflow-auto">
                <CategoryDetail
                  category={selectedCategory}
                  categories={categories}
                  onBack={handleBackFromCategoryDetail}
                  onSave={handleSaveCategory}
                  isCreating={isCreatingCategory}
                  onRefresh={fetchCategories}
                  onCreate={handleSaveCategory}
                />
              </div>
            </div>
          )}

          {menu === 'brands' && (
              <div className="grid grid-cols-3 gap-6 h-[calc(100vh-260px)]">
                <div className="col-span-2 bg-white rounded shadow overflow-hidden">
                  <BrandList
                      brands={brands}
                      onSelect={(id) => {
                        handleSelectBrand(id)
                        setIsCreatingBrand(false)
                      }}
                      onChangeStatus={changeBrandStatus}
                      onAdd={handleAddBrand}
                  />
                </div>

                <div className="col-span-1 bg-white rounded shadow overflow-auto">
                  <BrandDetail
                      brand={selectedBrand}
                      brands={brands}
                      isCreating={isCreatingBrand}
                      onBack={handleBackFromBrandDetail}
                      onRefresh={fetchBrands}
                  />
                </div>
              </div>
          )}


          {menu === 'transferProduct' && (
            <div className="bg-white rounded shadow p-4 min-h-[calc(100vh-260px)]">
              <TransferProduct
                products={products.map(p => ({ id: p.id, name: p.name }))}
                onTransfer={(payload) => {
                  setProducts(prev => prev.map(p =>
                    p.id === payload.productId ? { ...p, owner: payload.newOwner } : p
                  ));
                  alert('Đã chuyển sản phẩm thành công (local)');
                  handleMenuChange('products');
                  setSelectedProductId(payload.productId);
                }}
                onBack={() => handleMenuChange('products')}
              />
            </div>
          )}

          {menu === 'transferDelivery' && (
            <div className="bg-white rounded shadow p-4 min-h-[calc(100vh-260px)]">
              <TransferDelivery
                products={products.map(p => ({ id: p.id, name: p.name }))}
                onTransfer={(payload) => {
                  setProducts(prev => prev.map(p =>
                    p.id === payload.productId ? { ...p, owner: payload.newOwner } : p
                  ));
                  alert('Đã chuyển sản phẩm thành công (local)');
                  handleMenuChange('products');
                  setSelectedProductId(payload.productId);
                }}
                onBack={() => handleMenuChange('products')}
              />
            </div>
          )}

          {menu === 'analytics' && (
            <div className="bg-gray-50 min-h-[calc(100vh-260px)]">
              {scannedData ? (
                <ScannedPage product={scannedData} />
              ) : (
                <div className="p-6">
                  <h3 className="text-lg font-semibold">Analytics</h3>
                  <div className="text-sm text-gray-500 mt-2">
                    Chưa có dữ liệu quét — nhấn "Show QR (dev)" hoặc click mã QR của sản phẩm.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && editingProductId && (() => {
            const product = products.find(p => p.id === editingProductId);
            if (!product) return null;

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
                  manufactureDate: product.manufactureDate ?
                    (product.manufactureDate > 1e12 ? product.manufactureDate : product.manufactureDate * 1000) :
                    undefined,
                  expiryDate: product.expiryDate ?
                    (product.expiryDate > 1e12 ? product.expiryDate : product.expiryDate * 1000) :
                    undefined,
                  price: product.price || 0,
                  currency: product.currency || 'VND',
                  imagePath: product.imageUrl || product.image || '',
                  documentPath: (product as any).documentUrl || ''
                }}
                onSave={handleSaveProduct}
                onCancel={() => {
                  setShowEditModal(false);
                  setEditingProductId(null);
                }}
                asModal
              />
            );
          })()}

          {/* Create Modal */}
          {showCreateModal && (
            <ProductForm
              initial={{}}
              onSave={handleSaveProduct}
              onCancel={() => setShowCreateModal(false)}
              asModal
            />
          )}

          {/* Detail Modal */}
          {showDetail && selectedProductDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => {
                  setShowDetail(false);
                  setSelectedProductDetail(null);
                  setSelectedProductId(null);
                }}
              />
              <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden z-10 flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <ProductDetail
                    product={selectedProductDetail}
                    role={(() => {
                      if (!address) return 'viewer';
                      if (selectedProductDetail?.owner &&
                        address.toLowerCase() === selectedProductDetail.owner.toLowerCase()) {
                        return 'owner';
                      }
                      return 'consumer';
                    })()}
                    onBack={() => {
                      setShowDetail(false);
                      setSelectedProductDetail(null);
                      setSelectedProductId(null);
                    }}
                    onEdit={(id) => {
                      setShowDetail(false);
                      handleEditProduct(id);
                    }}
                    onDelete={(id) => {
                      setShowDetail(false);
                      handleDeleteProduct(id);
                    }}
                    onAction={(a) => {
                      if (a === 'verify') {
                        setScannedData(selectedProductDetail);
                        setShowDetail(false);
                        handleMenuChange('analytics');
                      }
                      if (a === 'transfer') {
                        setShowDetail(false);
                        handleMenuChange('transferProduct');
                      }
                    }}
                    onScanClick={(p) => {
                      setScannedData(p);
                      setShowDetail(false);
                      handleMenuChange('analytics');
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