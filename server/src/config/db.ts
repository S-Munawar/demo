import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const connectDB = async () => {

    try{
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI){
        throw new Error("MongoDB uri unavailable")
    }
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected")
    }
    catch(err){
        console.error("MonogDB connection error", err)
    }
}

mongoose.connection.on("dissconnected", ()=>{
    console.log("MongoDB disconnected")
})
mongoose.connection.on("error", (err)=>{
    console.error("MongoDB error", err)
})

export default connectDB