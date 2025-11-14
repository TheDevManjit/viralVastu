import mongoose, { disconnect } from 'mongoose'

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
    category:{type:String , required:true},
    brand:{type:String},
    offers:{type:String},
    tranding:{Boolean}


})


export const Product = mongoose.model("Product",productSchema)