import React from 'react'
import { FunnelPlus, Plus } from 'lucide-react'
import  ProductList  from '../components/ProductList'

function Products() {
  return (
    <div className='bg-white rounded-lg shadow-md p-4'>
      <div className='flex justify-between p-4 mb-4 border-b-2 border-[#848282]'>
        <span>Product List</span>
        <div className='flex gap-3'>
          <span className='flex gap-1 items-center border-2 border-[#848282] p-1 rounded-md cursor-pointer'>
            <FunnelPlus />
            Filter
          </span>
          <span className=' flex gap-1 items-center border-2 border-[#848282] p-1 rounded-md cursor-pointer'>
            See All
          </span>
          <span className='flex gap-1 items-center border-2 border-[#848282] p-1 rounded-md cursor-pointer'>
            <Plus />
            Add Items
          </span>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <ProductList />
        </div>
    </div>
  )
}

export default Products
