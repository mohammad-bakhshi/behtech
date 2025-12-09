import mongoose from "mongoose";
import { logger } from "../config/winston.js";

export const connectDB = async (url, dbName) => {
  if (!url || !dbName) {
    logger.error("Please provide a database URI string");
    process.exit(1);
  }
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(url, { dbName });
    logger.info("Database connection established!");
  } catch (error) {
    logger.error(`Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};
