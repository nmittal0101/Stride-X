import mongoose from "mongoose";

const adminschema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
         type:String,
        required:true,
    },

})

export const adminmodel =mongoose.model("admin",adminschema)