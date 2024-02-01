import mongoose from "mongoose";
import { config } from "./config.js";
import { logger } from "../helpers/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo.url);
    logger.info("database connected");
  } catch (error) {
    logger.error(`error connecting database: ${error.message}`);
  }
};
