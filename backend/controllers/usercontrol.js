import { usermodel } from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import {z} from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {purchasemodel} from "../models/purchasemodel.js";
import {productmodel} from "../models/productmodel.js"; 
dotenv.config();


export const signup = async (req,res) =>{
    const {username,email,password}=req.body;

    const userschema=z.object({
        username:z.string().min(2,{message:"username must contain only alphabets"}),
        email: z.string().email(),
        password:z.string().min(8,{message:"password must be of atleat 8 charactersand should contain a number, a special character,an uppercase and a lower case alphabet"}),
    })
    
    const validatedData= userschema.safeParse(req.body);
    if(!validatedData.success){
        return res.status(400).json({error:validatedData.error.issues.map(err=>err.message)});
    }

    const hashedPassword=await bcrypt.hash(password,10)

    try{
        const existingUser=await usermodel.findOne({email:email});
        if(existingUser){
            return res.status(400).json({error:"user already exists"});
        }
        const newUser= new usermodel({username,email,password:hashedPassword});
        await newUser.save();
        res.status(201).json({message:"signup successfull",newUser});
    
    }catch(error){
        res.status(500).json({error:"error in signup"});
        console.log("signup failed",error);

    }


};

export const signin = async (req,res) =>{
    const {email,password}=req.body;
    try{
        const user=await usermodel.findOne({email:email});
        const ispasswordCorrect= await bcrypt.compare(password,user.password)

        if(!user|| !ispasswordCorrect){
            return res.status(403).json({error:"Invalid login credentials"});
        }

        //jwt code
        const token=jwt.sign(
            {id: user._id},
        process.env.JWT_USER_PASSWORD,
        {expiresIn:"1d"});
        const cookieoptions={
            expires:new Date(Date.now()+ 24*60*60*1000), // 1 day
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",// true for https only
            sameSite:"Strict",// CSRF attacks
        }
        res.cookie("jwt",token, cookieoptions);
        res.status(201).json({message:"login successfull",user,token});


        res.status(201).json({message:"Login successfull",user, token});

    }catch(error){
        res.status(500).json({error:"error in login"});
        console.log("error in login", error);

    }
};

export const logout = (req,res) => {
    try{
        if(!req.cookies.jwt){
            return res.status(401).json({error:"kindly login first"});
        }
        res.clearCookie("jwt");
        res.status(200).json({message:"Logout successfull"});
    }catch(error){
        res.status(500).json({error:"error in logout"});
        console.log("error in logout", error);

    }
};

export const userdetails = async (req, res) => {
  try {
    console.log("userId", req.userid); 
    const user = await usermodel.findById(req.userid);

    res.status(200).json({data: user,message: "User details"});
    console.log("user", user);
} catch (error) {
    res.status(400).json({error:"error in fecting user details"});
}
};

export const updateuser = async (req, res) => {
  try {
    const sessionUser = req.userid;

    const { userid, email, name, role } = req.body;

    const payload = {
        ...(email && { email }),
        ...(name && { name }),
        ...(role && { role }),
    };

    const user = await usermodel.findById(sessionUser);

    const updatedUser = await usermodel.findByIdAndUpdate(userid, payload, { new: true });

    res.json({data: updatedUser,message: "User Updated",});
} catch (error) {
    res.status(400).json({error:"failed to update the current user"});
}
};

export const addToCart = async (req, res) => {
  try {
    const { productid } = req.body;
    const currentUser = req.userid;

    const isProductAvailable = await purchasemodel.findOne({ productid });
    if (isProductAvailable) {
      return res.json({message: "Already exists in Add to Cart",});
    }

    const payload = {
      productid,
      quantity: 1,
      userid: currentUser,
    };

    const newAddToCart = new purchasemodel(payload);
    const saveProduct = await newAddToCart.save();

    res.json({data: saveProduct,message: "Product Added in Cart",});
} catch (error) {
    res.status(500).json({error:"Failed to add product in cart"});
}
};

export const addToCartViewProduct = async(req,res)=>{

    try{
        const currentUser = req.userid

        const allProduct = await productmodel.find({userid : currentUser}).populate("productid")

        res.json({data : allProduct})

    }catch(error){
        res.json({error:"unable to view cart products"});
    }
};

export const updateAddToCartProduct = async (req, res) => {
    try {
        const currentUserId = req.userid;
        const addToCartProductId = req?.body?._id;
        const qty = req.body.quantity;

        const updateProduct = await purchasemodel.updateOne(
            { _id: addToCartProductId },
            {
                ...(qty && { quantity: qty })
            }
        );
        res.json({message: "Product Updated",data: updateProduct,});

    } catch (error) {
        res.status(400).json({error:"cant update the product"});
        console.log("error",error);
    }
};

export const deleteAddToCartProduct = async(req,res)=>{
    try{
        const currentUserId = req.userid 
        const addToCartProductId = req.body._id

        const deleteProduct = await purchasemodel.deleteOne({ _id : addToCartProductId})

        res.json({message : "Product Deleted From Cart"})

    }catch(error){
        res.json({error:"cannot delete product"})
    }
};

export const purchases=async(req,res)=>{
    const userid= req.userid;
    try {
        const purchased= await purchasemodel.find({userid});

        let purchasedproductid= [];

        for(let i=0; i<purchased.length; i++){
            purchasedproductid.push(purchased[i].productid);
        }
        const productdata= await productmodel.find({
            _id: {$in: purchasedproductid},
        });
    

        res.status(200).json({ purchased:purchased.map(p => p.toObject()),productdata:productdata.map(p => p.toObject())});
    
    }catch (error) {
        res.status(500).json({error:"error in purchase"});
        console.log("error in purchase",error);
        
    }
};

export const allUsers = async (req,res)=>{
    try{
        console.log("userid all Users",req.userid)

        const allUsers = await usermodel.find()
        
        res.json({message : "All User ",data : allUsers})
    }catch(error){
        res.status(400).json({error:"Failed to display users information"})
    }
};

