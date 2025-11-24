import React, { use } from 'react'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../api/productApi';
import { useEffect, useState } from 'react';








function ProductList() {
    const [products, setProducts] = useState([]);
  
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

        // Live fullName
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
    ];


    const rows = products.map((product, index) => ({
        SN: index + 1,
        id: product._id,
        productName: product.productName,
        Category: product.category,
        Brand: product.brand,
    }));




    useEffect(() => {
        // Fetch products from the API
        const fetchProducts = async () => {
            const products = await getAllProducts();

            setProducts(products);
        };

        fetchProducts();
    }, []);
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
