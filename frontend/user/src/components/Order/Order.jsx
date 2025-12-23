import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackButton from '../../commons/BackButton';
import { IP } from '../../config';
import PurchaseOrder from './PurchaseOrder';
import SaleOrder from './SaleOrder';
import { FiShoppingCart, FiDollarSign, FiShoppingBag, FiList } from 'react-icons/fi';

const Order = () => {
    const [activeTab, setActiveTab] = useState('sell');

    return (
        <div className="min-h-screen p-5 bg-gray-100">
            <div className="flex items-center mb-4">
                <BackButton />
            </div>
            {/* <div className="flex mb-4 w-full">
                <button 
                    className={`flex-1 px-4 py-2 rounded-md ${activeTab === 'sell' ? 'text-blue-500 font-bold underline bg-blue-200' : 'bg-white text-black'}`} 
                    onClick={() => setActiveTab('sell')}
                >
                    Đơn Bán
                </button>
                <button 
                    className={`flex-1 px-4 py-2 rounded-md ${activeTab === 'buy' ? 'text-blue-500 font-bold underline bg-blue-200' : 'bg-white text-black'}`} 
                    onClick={() => setActiveTab('buy')}
                >
                    Đơn Mua
                </button>
            </div> */}
            <div className="flex mb-4 w-full">
                <button 
                    className={`flex-1 flex items-center hover:underline justify-center px-4 py-2 ${activeTab === 'sell' ? 'text-black font-bold underline bg-yellow-400' : 'bg-white text-black'}`} 
                    onClick={() => setActiveTab('sell')}
                >
                    <FiList className="mr-2 text-black" />
                    Đơn Bán
                </button>
                <button 
                    className={`flex-1 flex items-center hover:underline justify-center px-4 py-2 ${activeTab === 'buy' ? 'text-black font-bold underline bg-yellow-400' : 'bg-white text-black'}`} 
                    onClick={() => setActiveTab('buy')}
                >
                    <FiShoppingBag className="mr-2 text-black" />
                    Đơn Mua
                </button>
            </div>

            {activeTab === 'sell' && (
                <SaleOrder />
            )}

            {activeTab === 'buy' && (
                <PurchaseOrder />
            )}
        </div>
    );
};

export default Order;