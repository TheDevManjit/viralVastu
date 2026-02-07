import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { getAllOrders, updateOrderStatus } from '../api/orderApi';
import { toast } from 'sonner';
import { Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log(`Updating status for ${id} to ${newStatus}`);
      const res = await updateOrderStatus(id, newStatus);
      console.log("Update response:", res);
      if (res.data.success) {
        toast.success("Order status updated");
        fetchOrders();
      } else {
        console.error("Update failed with success: false", res.data);
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const columns = [
    { field: 'sn', headerName: 'SN', width: 70 },
    { field: 'orderId', headerName: 'Order ID', width: 220 },
    { field: 'customer', headerName: 'Customer Name', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 120, renderCell: (params) => `₹${params.value}` },
    { field: 'date', headerName: 'Date', width: 180 },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <Select
          defaultValue={params.value}
          onValueChange={(value) => handleStatusChange(params.row._id, value)}
        >
          <SelectTrigger className={`w-[140px] ${params.value === 'Completed' ? 'text-green-600 border-green-200 bg-green-50' :
            params.value === 'Pending' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' :
              'text-blue-600'
            }`}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(params.row.rawOrder)}>
          <Eye className="w-5 h-5 text-gray-500" />
        </Button>
      ),
    }
  ];

  const rows = orders.map((order, index) => ({
    id: order._id,
    _id: order._id,
    sn: index + 1,
    orderId: order._id,
    customer: order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : order.user_id,
    amount: order.amount,
    status: order.status,
    date: new Date(order.createdAt).toLocaleDateString() + ' ' + new Date(order.createdAt).toLocaleTimeString(),
    rawOrder: order
  }));

  return (
    <div className="p-6 bg-white rounded-lg shadow-md m-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Order Management</h1>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 20]}
          disableRowSelectionOnClick
          loading={loading}
        />
      </Box>

      {/* Order Details Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Top Section: Status & ID */}
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="text-sm text-gray-500">Order ID</span>
                  <p className="font-mono font-medium">{selectedOrder._id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Validation Status</span>
                  <p className="font-medium">{selectedOrder.status}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <p className="font-bold text-lg">₹{selectedOrder.amount}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Info */}
                <div className="border p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Shipping Information</h3>
                  {selectedOrder.shippingAddress ? (
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                      <p>{selectedOrder.shippingAddress.email}</p>
                      <p>{selectedOrder.shippingAddress.phoneNumber}</p>
                      <hr className="my-2" />
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipcode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No shipping address provided.</p>
                  )}
                </div>

                {/* Products List */}
                <div className="border p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Ordered Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.products && selectedOrder.products.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded border overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No Img</div>
                          )}
                        </div>
                        <div className="text-sm">
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity} x ₹{item.price}</p>
                        </div>
                        <div className="ml-auto font-medium">
                          ₹{item.quantity * item.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Orders
