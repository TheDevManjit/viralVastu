import mongoose, { disconnect } from 'mongoose'
import { type } from 'os'

// id: 2,
   
    // price: 149.99,
    // originalPrice: 199.99,
    // rating: 4.9,
    // reviews: 2156,
    // image: "https://images.unsplash.com/photo-1669049358893-9a727252b5f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNoJTIwZGV2aWNlfGVufDF8fHx8MTc2MjUwODQyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    // badge: "Best Seller",
    // trending: true,

const productSchema = new mongoose.Schema({


    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productName: {type:String,required:true},
    productDescription: {type:String,required:true},
    productImg:[
        {
            url:{type:String,required:true},
            public_id: {type:String,required:true},
        }
    ]
    ,
    productPrice:{type:String},
    ProductOriginalPrice:{type:String},
    rating:{type:String},
    reviews:{type:Number},
    badge:{type:String},
    category:{type:String , required:true},
    brand:{type:String},
    offers:{type:String},
    trending:{Boolean}


})


export const Product = mongoose.model("Product",productSchema)