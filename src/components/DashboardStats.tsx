import React from 'react';
import type { Product } from '../hooks/useProducts';

interface DashboardStatsProps {
  products: Product[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ products }) => {
  const totalProducts = products.length;
  const nowSec = Math.floor(Date.now() / 1000);
  const expiredCount = products.filter(p => p.expiryDate && p.expiryDate > 0 && p.expiryDate < nowSec).length;
  const inCirculationCount = products.filter(p => p.status === 0).length;
  const soldCount = products.filter(p => p.status === 1).length;

  return (
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
  );
};