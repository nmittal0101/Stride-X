import express from "express";
import { createproduct, deleteproduct, updateproduct, getproducts, productdetails, buyproduct, searchProduct, getCategoryWiseProduct, getCategoryProduct, filterProductController } from "../controllers/productcontrol.js";
import userMiddleware from "../middleware/user.mid.js";
import adminMiddleware from "../middleware/admin.mid.js";


const router=express.Router()

router.post("/create",adminMiddleware,createproduct);
router.put("/update/:productid", adminMiddleware, updateproduct);
router.delete("/delete/:productid",adminMiddleware, deleteproduct);

router.get("/products/", getproducts);
router.get("/:productid", productdetails);
router.get("/search",searchProduct);
router.post("/categoryproduct",getCategoryWiseProduct);
router.get("/getcategory",getCategoryProduct);
router.post("/filterproduct",filterProductController);

router.post("/buyproduct", userMiddleware, buyproduct);


export default router;