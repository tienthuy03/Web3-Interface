import React from 'react';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { shortenAddr } from '../utils/helper';

export const Header: React.FC = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  return (
    <header className='container mx-auto py-2  border-b'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <div className="text-sm text-gray-500">Tổng quan sản phẩm</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="bg-slate-900 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
            onClick={() => open()}>
            {isConnected ? `${shortenAddr(address)}` : "Connect Wallet"}
          </button>
        </div>
      </div>
    </header>
  );
};