import express from "express";
import { addToCart, addToCartViewProduct, allUsers, deleteAddToCartProduct, logout, purchases, signin, signup, updateAddToCartProduct, updateuser, userdetails } from "../controllers/usercontrol.js";
import userMiddleware from "../middleware/user.mid.js";

const router=express.Router()

router.post("/signup",signup);
router.post("/signin",signin);
router.get("/logout",logout);
router.get("/purchases",userMiddleware,purchases);
router.get("/userdetails",userMiddleware,userdetails);
router.post("/updateuser",userMiddleware,updateuser);
router.post("/updateaddtocartproduct",userMiddleware,updateAddToCartProduct);
router.post("/addtocart",userMiddleware,addToCart);
router.get("/viewcartproduct",userMiddleware,addToCartViewProduct);
router.post("/deleteproduct",userMiddleware,deleteAddToCartProduct);
router.get("/alluser",userMiddleware,allUsers);



export default router;