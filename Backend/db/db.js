import mongoose from "mongoose";

function connectDB(){
    mongoose.connect(process.env.DB_CONNECT)
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log("Error connecting to DB", err);
    })

}

export default connectDB;