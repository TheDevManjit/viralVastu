import React from 'react'
import { NavLink } from 'react-router-dom'
import { User2, LayoutDashboard, ShoppingBag, MonitorCog, ListOrdered } from 'lucide-react'


function SideBar() {
    return (
        <div className=' hidden md:flex w-[15%] border-2 h-screen fixed top-0 bg-white left-0 px-4  flex-col justify-start gap-10'>
            <div>
                <img src="logo.svg" alt="" className='w-[100px] h-auto scale-250 mx-auto ' />
            </div>
            <div className='w-full'>
                <h3 className='flex items-center mb-3  text-2xl font-semibold'>
                    <LayoutDashboard />
                    <span className='ml-2'>
                        Dashboard
                    </span>

                </h3>

                <ul className='w-full flex flex-col gap-3 items-center text-lg '>
                    <li className='w-full border-2 hover:bg-[#f5f5f5] rounded'>
                        <NavLink
                            to="users"
                            className={({ isActive }) =>
                                `flex items-center gap-2 w-full p-2 ${isActive ? "text-[#5a16e2]" : ""
                                }`
                            }
                        >
                            <User2 />
                            <span className="">Users</span>
                        </NavLink>
                    </li>
                    <li className='w-full border-2 hover:bg-[#f5f5f5] rounded'>
                        <NavLink
                            to="products"
                            className={({ isActive }) =>
                                `flex items-center gap-2 w-full p-2 ${isActive ? "text-[#5a16e2]" : ""
                                }`
                            }
                        >
                            <ShoppingBag />
                            <span>Products</span>
                        </NavLink>
                    </li>
                    <li className='w-full border-2 hover:bg-[#f5f5f5] rounded   '>
                        <NavLink 
                           to="orders"
                        className={({ isActive }) =>
                                `flex items-center gap-2 w-full p-2 ${isActive ? "text-[#5a16e2]" : ""
                                }`
                            }>
                            <ListOrdered />
                            <span>Orders</span>
                        </NavLink>
                    </li>
                    <li className='w-full border-2 hover:bg-[#f5f5f5] rounded   '>
                        <NavLink 
                           to="Settings"
                        className={({ isActive }) =>
                                `flex items-center gap-2 w-full p-2 ${isActive ? "text-[#5a16e2]" : ""}`
                            }>
                            <MonitorCog />
                            <span>App Setting</span>
                        </NavLink>
                    </li>
                </ul>
            </div>

        </div>
    )
}

export default SideBar
