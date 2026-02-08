import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { getAllUsers, deleteUser, updateUser } from '../api/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '@/redux/userSlice';
import { toast } from 'sonner';
import { Trash, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Users() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (res.data.success) {
        dispatch(setUsers(res.data.users));
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await deleteUser(id);
      if (res.data.success) {
        toast.success("User deleted successfully");
        fetchUsers(); // Refresh list
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
    setIsEditOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const res = await updateUser(editUser._id, formData);
      if (res.data.success) {
        toast.success("User updated successfully");
        setIsEditOpen(false);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user");
    }
  };

  const columns = [
    { field: 'sn', headerName: 'SN', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'role', headerName: 'Role', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-4 items-center h-full">
          <button
            onClick={() => handleEditClick(params.row)}
            className="text-skybrand-600 hover:text-skybrand-800 flex items-center gap-1 font-medium transition-colors"
          >
            <Edit size={16} /> Edit
          </button>
          <button
            onClick={() => handleDelete(params.row._id)}
            className="text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <Trash size={16} /> Delete
          </button>
        </div>
      ),
    }
  ];

  const [searchText, setSearchText] = useState('');

  // ... existing code ...

  const filteredUsers = users?.filter(user =>
    user.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const rows = filteredUsers.map((user, index) => ({
    id: user._id, // DataGrid needs a unique 'id' property
    _id: user._id, // Keep original _id for actions
    sn: index + 1,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  }));

  return (
    <div className="p-6 bg-white rounded-lg shadow-md m-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>

      <div className="mb-4">
        <Input
          placeholder="Search by name or email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-sm"
        />
      </div>
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

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Users
