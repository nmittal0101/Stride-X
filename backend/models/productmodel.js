import mongoose from "mongoose";

const productschema= new mongoose.Schema({
    productname:{
        type:String,
        required:true,
    },
    brandname:{
         type:String,
        required:true,
    },
    category:{
         type:String,
        required:true,
    },
    pimage:{
        public_id:{
             type:String,
             required:true,
        },
        url:{
             type:String,
             required:true,
        }
    },
    description:{
         type:String,
        required:true,
    },
    price:{
         type:Number,
        required:true,
    },
    creatorid:{
        type:mongoose.Types.ObjectId,
        ref:"usermodel",
    },
})

export const productmodel=mongoose.model("product",productschema)