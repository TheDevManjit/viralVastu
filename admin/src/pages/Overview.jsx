import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../api/orderApi';
import { getAllUsers } from '../api/userApi';
import { toast } from 'sonner';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { Loader2 } from 'lucide-react';

function Overview() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        orders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, usersRes] = await Promise.all([
                    getAllOrders(),
                    getAllUsers()
                ]);

                if (ordersRes.data.success && usersRes.data.success) {
                    const orders = ordersRes.data.orders;
                    const users = usersRes.data.users;

                    // Calculate Revenue
                    const revenue = orders.reduce((acc, order) => {
                        return acc + (order.amount || 0);
                    }, 0);

                    setStats({
                        totalRevenue: revenue,
                        totalOrders: orders.length,
                        totalUsers: users.length,
                        orders: orders
                    });
                }
            } catch (error) {
                toast.error("Failed to load dashboard data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full min-h-[400px]"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>
    }

    // Prepare Data for Charts
    const orderStatusData = [
        { name: 'Pending', value: stats.orders.filter(o => o.status === 'Pending').length },
        { name: 'Processing', value: stats.orders.filter(o => o.status === 'Processing').length },
        { name: 'Shipped', value: stats.orders.filter(o => o.status === 'Shipped').length },
        { name: 'Delivered', value: stats.orders.filter(o => o.status === 'Delivered').length },
        { name: 'Completed', value: stats.orders.filter(o => o.status === 'Completed').length },
        { name: 'Cancelled', value: stats.orders.filter(o => o.status === 'Cancelled').length },
    ].filter(item => item.value > 0);

    const revenueByDate = {};
    stats.orders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString();
        revenueByDate[date] = (revenueByDate[date] || 0) + order.amount;
    });

    const chartData = Object.keys(revenueByDate).map(date => ({
        name: date,
        Revenue: revenueByDate[date]
    })).slice(-7);

    const COLORS = ['#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#8884d8', '#ff4d4f'];

    return (
        <div className="p-6 overflow-y-auto h-full fade-in animate-in">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-transform hover:scale-105">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full">
                        <DollarSign size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Revenue</p>
                        <h2 className="text-3xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-transform hover:scale-105">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                        <ShoppingBag size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Orders</p>
                        <h2 className="text-3xl font-bold text-gray-800">{stats.totalOrders}</h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-transform hover:scale-105">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <h2 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h2>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-500" /> Revenue Trend
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-4">Order Status Distribution</h3>
                    <div className="h-[300px] flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview;
