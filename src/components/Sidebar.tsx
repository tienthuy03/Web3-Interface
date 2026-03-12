import React from 'react';
import { ExternalLink } from 'lucide-react';
import { shortenAddr } from '../utils/helper';
import { CONTRACT_ADDRESS } from '../contracts/contractData';

interface SidebarProps {
  activeMenu: 'products' | 'categories' | 'brands' | 'analytics' | 'transferProduct' | 'transferDelivery';
  onMenuChange: (menu: 'products' | 'categories' | 'brands' | 'analytics' | 'transferProduct' | 'transferDelivery') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="px-6 py-6 flex items-center gap-3 border-b">
        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">B</div>
        <div>
          <div className="font-semibold">Business</div>
          <div className='flex items-center gap-2'>
            <a className='flex items-center gap-1 text-sm hover:bg-gray-200 p-1 rounded-lg'
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank" rel="noreferrer">
              {shortenAddr(CONTRACT_ADDRESS)}
              <ExternalLink className='w-3 h-3' />
            </a>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onMenuChange('products')}
              className={`w-full text-left px-3 py-2 rounded ${activeMenu === 'products' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>
              Products
            </button>
          </li>
          <li>
            <button
              onClick={() => onMenuChange('categories')}
              className={`w-full text-left px-3 py-2 rounded ${activeMenu === 'categories' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>
              Categories
            </button>
          </li>
          <li>
            <button
              onClick={() => onMenuChange('brands')}
              className={`w-full text-left px-3 py-2 rounded ${activeMenu === 'brands' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>
              Brands
            </button>
          </li>
          <li>
            <button
              onClick={() => onMenuChange('transferProduct')}
              className={`w-full text-left px-3 py-2 rounded ${activeMenu === 'transferProduct' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>
              Transfer Product
            </button>
          </li>
          <li>
            <button
              onClick={() => onMenuChange('transferDelivery')}
              className={`w-full text-left px-3 py-2 rounded ${activeMenu === 'transferDelivery' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>
              Transfer Delivery
            </button>
          </li>
          <li>
            <button
              onClick={() => onMenuChange('analytics')}
              className={`w-full text-left px-3 py-2 rounded ${activeMenu === 'analytics' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}>
              Analytics
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Settings</button>
      </div>
    </aside>
  );
};