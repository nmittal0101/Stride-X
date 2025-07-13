import { productmodel } from "../models/productmodel.js";
import { v2 as cloudinary } from 'cloudinary';
import { purchasemodel } from "../models/purchasemodel.js";
import mongoose from "mongoose";

export const createproduct = async (req,res) =>{
    const admninid=req.admninid;
    const {productname,brandname,category,description,price}=req.body;


try{
    if(!productname || !brandname || !category || !description || !price){
        return res.status(400).json({errors: "All fields are required"});

    }
    const {pimage}= req.files;
    if(!req.files || Object.keys(req.files).lenght===0){
        return res.status(400).json({errors:"No file uploaded"});
    }

    const allowedformat=["image/png", "image/jpeg"]
    if(!allowedformat.includes(pimage.mimetype)){
        return res.status(400).json({error:"invalid file format. only jpeg and png allowed"});
    }
    
    //cloudinary code
    const cloud_response=await cloudinary.uploader.upload(pimage.tempFilePath)
    if(!cloud_response || cloud_response.error){
        return res.status(400).json({error:"error uploading file to cloudinary"});
    }
    
    const productdata={
        productname,
        brandname,
        category,
        pimage:{
            public_id: cloud_response.public_id,
            url: cloud_response.url,
        },
        creatorid:admninid,
        description,
        price

    };
   const product= await productmodel.create(productdata)
   return res.status(201).json({
    message:"product created successfully", data: productdata });
}catch(error){
    console.error("Product creation error:", error);
    return res.status(500).json({error:"error creating product"});
}
};

export const updateproduct = async (req,res) => {
    const admninid=req.admninid;
    const {productid}=req.params;
    const{ productname, description,price,pimage}=req.body;
    try{
        const productsearch= await productmodel.findById(productid);
        if(!productsearch){
            return res.status(404).json({error:"product not found"});
        }
        const product = await productmodel.updateOne({
            _id:productid,
            creatorid:admninid,
        },{
            productname,
            description,
            price,
            pimage:{
                public_id: pimage?.public_id ,
                url: pimage?.url ,
            }
        })
        res.status(201).json({message:"Product Updated Successfully",product})
    }catch(error){
        res.status(500).json({error:"Error Updating Product"})
        console.log("error:",error)

    }

};

export const deleteproduct = async (req,res) => {
     const admninid=req.admninid;
    const {productid}=req.params;
    try{
        const product = await productmodel.findOneAndDelete({
            _id: productid,
            creatorid:admninid
        });
        if(!product){
            return res.status(404).json({error:"Product Not found"});
        }
        res.status(201).json({message:"Product deletd successfully"});
    }catch(error){
        res.status(500).json({error:"Error in deleting product"});
        console.log("error:",error);

    }

};

export const getproducts = async (req,res) => {
    try{
        const product= await productmodel.find({});
        res.status(201).json({product}); 
    }catch(error){
        res.status(500).json({errors:"Error in getting products"});
        console.log("error",error);
    }
};

export const productdetails = async (req,res) =>{
    const {productid}= req.params;
    try{
        const product= await productmodel.findById(productid);
        if(!product){
            return res.status(404).json({error:"product not found"});
        }
        res.status(200).json({product});
    }catch(error){
        res.status(500).json({error:"error in getiing product details"});
        console.log("error",error);
    }

};

export const searchProduct = async(req,res)=>{
    try{
        const query = req.query.q 
        const regex = new RegExp(query,'i','g')
        const product = await productmodel.find({
            "$or" : [
                {
                    productName : regex
                },
                {
                    category : regex
                }
            ]
        })


        res.json({
            data  : product ,
            message : "Search Product list",
        })
    }catch(error){
        res.json({error:"no product found"})
    }
};

export const getCategoryWiseProduct = async(req,res)=>{
    try{
        const { category } = req?.body || req?.query
        const product = await productmodel.find({ category })

        res.json({
            data : product,
            message : "Product",
        })
    }catch(error){
        res.status(400).json({error:"error"})
    }
};

export const getCategoryProduct = async(req,res)=>{
    try{
        const productCategory = await productmodel.distinct("category")

        console.log("category",productCategory)

        //array to store one product from each category
        const productByCategory = []

        for(const category of productCategory){
            const product = await productmodel.findOne({category })

            if(product){
                productByCategory.push(product)
            }
        }


        res.json({
            message : "category product",
            data : productByCategory,
        })


    }catch(error){
        res.status(400).json({error:"failed to get category one products"})
    }
};

export const filterProductController = async(req,res)=>{
 try{
        const categoryList = req?.body?.category || []

        const product = await productmodel.find({
            category :  {
                "$in" : categoryList
            }
        })

        res.json({
            data : product,
            message : "product",
        })
 }catch(error){
    res.json({error:""
    })
 }
};

export const buyproduct = async (req,res) => {

    const{userid}= req.userid;
    const{productid}=req.body;

    if (!mongoose.Types.ObjectId.isValid(productid)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        const product=await productmodel.findById(productid);
        if(!product){
            return res.status(404).json({error:"product not found"});
        }
        const purcahse= new purchasemodel({userid,productid});
        await purcahse.save();
    } catch (error) {
        res.status(500).json({error:"error in buying product"});
        console.log("error in buying product",error);
        
    }

};

