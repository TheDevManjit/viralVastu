import React from 'react'
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
        { field: 'SN', headerName: 'SN', width: 60 },
        {
            field: 'productImg',
            headerName: 'Image',
            width: 80,
            renderCell: (params) => (
                <div className="flex items-center justify-center h-full">
                    {params.row.productImg?.[0] ? (
                        <img
                            src={params.row.productImg[0].url}
                            alt="thumb"
                            className="w-10 h-10 object-cover rounded shadow-sm"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded" />
                    )}
                </div>
            )
        },
        {
            field: 'productName',
            headerName: 'Product name',
            width: 250,
            editable: false,
        },
        {
            field: 'productCategory',
            headerName: 'Category',
            width: 150,
            renderCell: (params) => (
                <div className="flex flex-wrap gap-1">
                    {Array.isArray(params.value) ? params.value.join(", ") : params.value}
                </div>
            )
        },
        {
            field: 'productBrand',
            headerName: 'Brand',
            width: 130,
        },
        {
            field: 'productStock',
            headerName: 'Stock',
            type: 'number',
            width: 100,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <div className="flex gap-4 items-center h-full">
                    <Link
                        to={`/product/${params.row._id}`}
                        className="text-skybrand-600 hover:text-skybrand-800 font-medium transition-colors"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => handleDelete(params.row._id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors flex items-center gap-1"
                    >
                        <Trash size={16} /> Delete
                    </button>
                </div>
            ),
        }
    ];


    const rows = products.map((product, index) => ({
        id: product._id, // DataGrid needs this
        _id: product._id,
        SN: index + 1,
        productImg: product.productImg,
        productName: product.productName,
        productCategory: product.productCategory,
        productBrand: product.productBrand,
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
