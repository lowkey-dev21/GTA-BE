import "dotenv/config";
import mongoose from "mongoose";

export const mongooDBConnect = async () => {
  // connect to MongoDB and start the server
  try {
    const con = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected to : ${con.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
