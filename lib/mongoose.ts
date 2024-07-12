import mongoose from "mongoose";



// track connection status
let isConnected =  false;
// const uri = 'mongodb+srv://devlopezsarmiento:B0rc0l0n02024!@cluster0.umwfsmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//const uri = 'mongodb+srv://sumercisco:B0rc0l0n02024!@cluster0.li1zu39.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const uri = String(process.env.MONGODB_URI);

export const connectToDatabase = async () => {

  // prevent unknown field queries
  mongoose.set("strict", true);

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    return;
  }

  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  try {
    console.log('uri::::', uri);
    await mongoose.connect(uri);
    isConnected = true;
    console.log("mongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to database", error);
  }
  
};