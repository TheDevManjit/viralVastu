import React, { use } from 'react'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../api/productApi';
import { useEffect, useState } from 'react';
import { Trash } from 'lucide-react';
import { deleteProduct } from '../api/productApi';
import { toast } from 'sonner';
import store from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts } from '@/redux/productSlice';









function ProductList() {
    
    const { products } = useSelector(store => store.products);
    const dispatch = useDispatch()

    const columns = [
        { field: 'SN', headerName: 'SN', width: 90 },
        { field: 'id', headerName: 'id', width: 90 },

        {
            field: 'productName',
            headerName: 'Product name',
            width: 150,
            editable: false,
        },

        {
            field: 'Category',
            headerName: 'Category',
            type: 'number',
            width: 110,
            editable: true,
        },


        {
            field: 'Brand',
            headerName: 'Brand',
            width: 160,
            sortable: false,
            // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,  // combine first and last name
        },

        // Clickable details link
        {
            field: "details",
            headerName: "Details",
            width: 160,
            sortable: false,
            renderCell: (params) => (
                <Link
                    to={`/product/${params.row.id}`}
                    className="text-blue-500 underline cursor-pointer"
                >
                    View/Update Details
                </Link>
            ),
        },
        {
            field: "Delete",
            headerName: "Delete",
            width: 160,
            sortable: false,
            renderCell: (params) => (
                <Link

                    className="text-blue-500 underline cursor-pointer flex items-center gap-2"
                    onClick={() => handleDelete(params.row.id)}
                >
                    <Trash />  Delete
                </Link>
            ),
        },

         {
            field: 'productStock',
            headerName: 'Stock',
            type: 'number',
            width: 110,
            editable: true,
        },
    ];


    const rows = products.map((product, index) => ({
        SN: index + 1,
        id: product._id,
        productName: product.productName,
        Category: product.category,
        Brand: product.brand,
        productStock: product.productStock,
    }));

    console.log("Products in store:", products);

    async function fetchProducts() {
        try {
            const res = await getAllProducts()
            dispatch(setProducts(res.data.products));

        } catch (error) {
            toast.error(error?.data?.message || "Unexpected error");
        }
    }


    useEffect(() => {

        fetchProducts()
    }, []);



    // console.log(products)


    async function handleDelete(id) {

        console.log("Delete product with id:", id);

        try {
            const res = await deleteProduct(id)
            if (res?.data?.success) {
                toast.success(res.data.message || "Product deleted successfully");

                const updated = products.filter((p) => p._id !== id);
                dispatch(setProducts(updated));
                return;
            }


            toast.error(res?.data?.message || "Something went wrong");

        } catch (error) {
            toast.error(error?.data?.message || "Unexpected error");
        }

    }





    return (
        <Box sx={{ height: 700, width: '100%' }}>
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
                pageSizeOptions={[10]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    )
}

export default ProductList
