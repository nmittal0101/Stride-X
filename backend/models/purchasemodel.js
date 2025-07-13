import mongoose from "mongoose";

const purcahseschema= new mongoose.Schema({
    userid:{
        type:mongoose.Types.ObjectId,
        ref:"usermodel",
    },
    productid:{
        type:mongoose.Types.ObjectId,
        ref:"productmodel",
    },
    quantity:{
        type:Number,
        required:true,
    },
});

export const purchasemodel=mongoose.model("purchase",purcahseschema);