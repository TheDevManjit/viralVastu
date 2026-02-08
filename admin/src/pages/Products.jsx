import React from 'react'
import { FunnelPlus, Plus } from 'lucide-react'
import ProductList from '../components/ProductList'
import { Link } from 'react-router-dom'





function Products() {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100'>
        <h1 className='text-2xl font-bold text-gray-800'>Product Inventory</h1>
        <div className='flex flex-wrap gap-3'>
          <button className='flex gap-2 items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors'>
            <FunnelPlus size={18} />
            Filter
          </button>
          <button className='flex gap-2 items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors'>
            See All
          </button>

          <Link to="/add-product" className='flex gap-2 items-center bg-skybrand-600 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-skybrand-700 transition-colors shadow-sm'>
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <ProductList />
      </div>
    </div>
  )
}

export default Products
