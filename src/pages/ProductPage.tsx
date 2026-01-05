import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ScannedPage from '../components/ScannedPage'
import { getProductFromChain } from '../contracts/contractInteraction'

export default function ProductPage() {
  const location = useLocation()
  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      // Parse ID from pathname: /products/123 or /product/123
      const pathMatch = location.pathname.match(/\/(?:products?|product)\/(.+)$/)
      const id = pathMatch ? pathMatch[1] : null
      
      console.log('🚀 ProductPage: Starting fetch, pathname:', location.pathname, 'id:', id)
      
      if (!id) {
        console.error('❌ ProductPage: No ID found in URL pathname')
        setError('Không tìm thấy ID sản phẩm')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const productId = parseInt(id, 10)
        
        console.log('🔍 ProductPage: Parsed product ID:', productId, 'from string:', id)
        
        if (isNaN(productId) || productId <= 0) {
          console.error('❌ ProductPage: Invalid product ID:', productId)
          setError(`ID sản phẩm không hợp lệ: ${id}`)
          setLoading(false)
          return
        }

        console.log('📡 ProductPage: Calling getProductFromChain with ID:', productId)
        const productData = await getProductFromChain(productId)
        
        console.log('📦 ProductPage: Received product data:', productData)
        
        // Check if product exists
        if (!productData) {
          console.error('❌ ProductPage: No product data returned')
          setError(`Không tìm thấy sản phẩm với ID: ${productId}`)
          setLoading(false)
          return
        }
        
        // Check if product has valid ID (even if 0, it's valid)
        if (productData.id === undefined || productData.id === null) {
          console.error('❌ ProductPage: Product data missing ID field')
          setError(`Sản phẩm ID ${productId} không có dữ liệu hợp lệ (thiếu ID)`)
          setLoading(false)
          return
        }
        
        console.log('✅ ProductPage: Product data validated, ID:', productData.id)
        
        // Map data to match ScannedPage expected format
        // Handle imageURI - if it's a relative path, convert to full URL
        let imageUrl = productData.imageUrl || productData.imageURI || ''
        if (imageUrl && imageUrl.startsWith('/public/')) {
          // Convert relative path to full URL
          const baseUrl = window.location.origin
          imageUrl = `${baseUrl}${imageUrl}`
        }
        
        // Use category as name if name is empty or looks like a placeholder (0x...)
        let productName = productData.name || ''
        if (!productName || productName.startsWith('0x') || productName === productData.sku) {
          productName = productData.category || 'Sản phẩm'
        }
        
        const mappedProduct = {
          id: productData.id,
          name: productName,
          price: productData.price || 0,
          description: productData.description || '',
          ingredients: productData.ingredients || '',
          manufactureDate: productData.manufactureDate,
          expiryDate: productData.expiryDate,
          createdAt: productData.createdAt,
          owner: productData.owner || '',
          status: productData.status || 0,
          imageUrl: imageUrl,
          // Additional fields for ScannedPage
          category: productData.category || '',
          brand: productData.brand || '',
          originCountry: productData.originCountry || '',
          currency: productData.currency || 'VND',
          sku: productData.sku || '',
          batchNumber: productData.batchNumber || '',
        }

        console.log('✅ ProductPage: Mapped product:', mappedProduct)
        setProduct(mappedProduct)
      } catch (err: any) {
        console.error('❌ ProductPage: Error fetching product:', err)
        console.error('❌ ProductPage: Error details:', {
          message: err?.message,
          code: err?.code,
          data: err?.data,
          stack: err?.stack
        })
        
        // Extract user-friendly error message
        let errorMessage = 'Không thể tải thông tin sản phẩm'
        if (err?.message) {
          errorMessage = err.message
        } else if (err?.code === 'CALL_EXCEPTION') {
          errorMessage = `Sản phẩm ID ${id} không tồn tại trên blockchain`
        } else if (err?.code === 'NETWORK_ERROR') {
          errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.'
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [location.pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-500 to-emerald-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-500 to-emerald-700 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">{error || 'Không tìm thấy sản phẩm'}</p>
          <a href="/" className="underline">Quay lại trang chủ</a>
        </div>
      </div>
    )
  }

  return <ScannedPage product={product} />
}

