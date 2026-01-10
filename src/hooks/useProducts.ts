import { useState, useEffect } from 'react';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, Contract } from 'ethers';
import { ABI, CONTRACT_ADDRESS } from '../contracts/contractData';
import { getProductsFromChain, getProductFromChain, getAllCategory } from '../contracts/contractInteraction';
import type { Product } from '../types/product';
import type { Category } from '../types/category';

export const useProducts = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchContractData = async () => {
    if (!walletProvider) {
      console.log("❌ walletProvider NOT FOUND");
      return;
    }

    try {
      setLoadingProducts(true);
      const ethersProvider = new BrowserProvider(walletProvider);
      const chainProducts = await getProductsFromChain(ethersProvider);

      if (!Array.isArray(chainProducts)) {
        console.error("❌ chainProducts is NOT array", chainProducts);
        return;
      }

      const mapped = chainProducts.map((p: any, index: number) => ({
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
        imageUrl: p.imageUrl ?? "",
        category: p.category ?? "",
        brand: p.brand ?? "",
        currency: p.currency ?? "VND",
        origin: p.origin ?? "",
        documentUrl: p.documentUrl ?? "",
        verifyStatus: p.verifyStatus !== undefined ? Number(p.verifyStatus) : undefined,
      }));

      const chainCategories = await getAllCategory(ethersProvider);
      setCategories(chainCategories);
      setProducts(mapped);
    } catch (err) {
      console.error("❌ fetchContractData ERROR:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchProductDetail = async (productId: string): Promise<Product | null> => {
    try {
      setLoadingDetail(true);
      const productIdNum = Number(productId);
      if (isNaN(productIdNum)) {
        throw new Error("ID sản phẩm không hợp lệ");
      }

      const productData = await getProductFromChain(productIdNum);

      if (productData) {
        return {
          ...productData,
          id: productData.id?.toString() || productId,
          imageUrl: productData.imageURI || "",
          category: productData.category || "",
          brand: productData.brand || "",
          currency: productData.currency || "VND",
          batchNumber: productData.batchNumber || "",
          sku: productData.sku || "",
          originCountry: productData.originCountry || "",
          origin: productData.originCountry || "",
          createdAt: productData.createdAt || 0,
          manufactureDate: productData.manufactureDate || 0,
          expiryDate: productData.expiryDate || 0,
          owner: productData.owner || "",
          description: productData.description || "",
          ingredients: productData.ingredients || "",
          price: productData.price || 0,
          status: productData.status || 0,
          documentUrl: productData.documentURI || "",
          name: productData.name || productData.category || "Sản phẩm không tên",
        };
      }
      throw new Error("Không nhận được dữ liệu từ contract");
    } catch (err) {
      console.error("❌ fetchProductDetail ERROR:", err);
      const localProduct = products.find(p => p.id === productId);
      if (localProduct) {
        return localProduct;
      }
      throw err;
    } finally {
      setLoadingDetail(false);
    }
  };

  const changeCategoryStatus = async (id: number, active: boolean) => {
    if (!walletProvider) return;

    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.setCategoryStatus(id, active);
      await tx.wait();

      setCategories(prev =>
        prev.map(cat =>
          cat.id === id ? { ...cat, active } : cat
        )
      );
      alert('Thay đổi thành công');
    } catch (err) {
      console.error('❌ changeCategoryStatus error:', err);
      alert('Không thể thay đổi trạng thái category');
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [walletProvider]);

  return {
    products,
    categories,
    loadingProducts,
    loadingDetail,
    setProducts,
    setCategories,
    fetchProductDetail,
    changeCategoryStatus,
    refetch: fetchContractData
  };
};