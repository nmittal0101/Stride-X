import bcrypt from "bcryptjs";
import {z} from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { adminmodel } from "../models/adminmodel.js";
dotenv.config();

export const signup = async (req,res) =>{
    const {username,email,password}=req.body;

    const adminschema=z.object({
        username:z.string().min(2,{message:"username must contain only alphabets"}),
        email: z.string().email(),
        password:z.string().min(8,{message:"password must be of atleat 8 charactersand should contain a number, a special character,an uppercase and a lower case alphabet"}),
    })
    
    const validatedData= adminschema.safeParse(req.body);
    if(!validatedData.success){
        return res.status(400).json({error:validatedData.error.issues.map(err=>err.message)});
    }

    const hashedPassword=await bcrypt.hash(password,10)

    try{
        const existingAdmin=await adminmodel.findOne({email:email});
        if(existingAdmin){
            return res.status(400).json({error:"Admin already exists"});
        }
        const newAdmin= new adminmodel({username,email,password:hashedPassword});
        await newAdmin.save();
        res.status(201).json({message:"signup successfull",newAdmin});
    
    }catch(error){
        res.status(500).json({error:"error in signup"});
        console.log("signup failed",error);

    }


};

export const signin = async (req,res) =>{
    const {email,password}=req.body;
    try{
        const admin=await adminmodel.findOne({email:email});
        const ispasswordCorrect= await bcrypt.compare(password,admin.password)

        if(!admin|| !ispasswordCorrect){
            return res.status(403).json({error:"Invalid login credentials"});
        }

        //jwt code
        const token=jwt.sign(
            {id: admin._id},
        process.env.JWT_ADMIN_PASSWORD,
        {expiresIn:"1d"});
        const cookieoptions={
            expires:new Date(Date.now()+ 24*60*60*1000), // 1 day
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",// true for https only
            sameSite:"Strict",// CSRF attacks
        }
        res.cookie("jwt",token, cookieoptions);
        res.status(201).json({message:"login successfull",admin,token});


        res.status(201).json({message:"Login successfull",admin, token});

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
