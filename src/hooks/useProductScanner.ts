import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProductFromChain } from '../contracts';

export const useProductScanner = () => {
  const location = useLocation();
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);
  const [loadingScan, setLoadingScan] = useState(false);

  useEffect(() => {
    const pathMatch = location.pathname.match(/\/(?:products?|product)\/(.+)$/);
    if (pathMatch) {
      const pIdStr = pathMatch[1];
      const pIdNum = Number(pIdStr);

      if (!isNaN(pIdNum)) {
        const loadFromChain = async () => {
          setLoadingScan(true);
          try {
            const data = await getProductFromChain(pIdNum);
            if (data) {
              setScannedProduct(data);
            } else {
              console.error("Sản phẩm không tồn tại trên Chain");
            }
          } catch (err) {
            console.error("Lỗi khi fetch sản phẩm quét:", err);
          } finally {
            setLoadingScan(false);
          }
        };
        loadFromChain();
      }
    }
  }, [location.pathname]);

  return { scannedProduct, loadingScan };
};