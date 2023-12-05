import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

const InitiateMongoServer = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default InitiateMongoServer;
