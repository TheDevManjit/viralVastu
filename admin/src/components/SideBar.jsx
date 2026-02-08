import React from 'react'
import { NavLink } from 'react-router-dom'
import { User2, LayoutDashboard, ShoppingBag, MonitorCog, ListOrdered } from 'lucide-react'


function SideBar() {
    return (
        <div className='hidden md:flex w-[260px] border-r h-screen sticky top-0 bg-white left-0 px-4 flex-col justify-start gap-8 shadow-sm'>
            <div className="py-6 flex justify-center">
                <img src="/logo.png" alt="Logo" className='h-32 w-auto object-contain' />
            </div>
            <div className='w-full'>
                <NavLink to="/" end className={({ isActive }) =>
                    `flex items-center mb-6 text-xl font-bold px-2 transition-colors ${isActive ? "text-skybrand-700" : "text-gray-800 hover:text-skybrand-600"}`
                }>
                    <LayoutDashboard className="mr-2" />
                    Dashboard
                </NavLink>

                <nav>
                    <ul className='w-full flex flex-col gap-2 text-base font-medium'>
                        <li className='w-full'>
                            <NavLink
                                to="users"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${isActive
                                        ? "text-skybrand-700 bg-skybrand-50 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-skybrand-600"
                                    }`
                                }
                            >
                                <User2 size={20} />
                                <span>Users</span>
                            </NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink
                                to="products"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${isActive
                                        ? "text-skybrand-700 bg-skybrand-50 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-skybrand-600"
                                    }`
                                }
                            >
                                <ShoppingBag size={20} />
                                <span>Products</span>
                            </NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink
                                to="orders"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${isActive
                                        ? "text-skybrand-700 bg-skybrand-50 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-skybrand-600"
                                    }`
                                }>
                                <ListOrdered size={20} />
                                <span>Orders</span>
                            </NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink
                                to="settings"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${isActive
                                        ? "text-skybrand-700 bg-skybrand-50 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-skybrand-600"
                                    }`
                                }>
                                <MonitorCog size={20} />
                                <span>App Setting</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default SideBar
