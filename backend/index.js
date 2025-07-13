import express from "express";
import dotenv from "dotenv"
import Mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import productroute from "./routes/productroute.js";
import userroute from "./routes/userroute.js";
import fileUpload from "express-fileupload";
import adminroute from "./routes/adminroute.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
})
);

const port = process.env.PORT || 3000;
const DB_URI=process.env.MONGO_URI;

try{
  await Mongoose.connect(DB_URI);
  console.log("connected to MongoDB");
}catch(error){
  console.log(error);
}

//defining routes
app.use("/api/v1/product", productroute);
app.use("/api/v1/user", userroute);
app.use("/api/v1/admin", adminroute);
app.use(fileUpload());


//cloudinary configuration code
cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret, 
    });

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})


