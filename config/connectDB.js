import mongoose from "mongoose";

export const connectDB = async (url, dbName) => {
  if (!url) {
    console.log("Please provide a database URI string");
    process.exit(1);
  }
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(url, { dbName });
    console.log("Database connection established!");
  } catch (error) {
    console.error(`Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};
