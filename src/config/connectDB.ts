import mongoose from "mongoose";

import { SystemSettingsModel } from "../models/v1/systemSettings.model";

import { MONGODBURL } from "./env";

// setting wage by admin

async function initializeSystemSettings() {
  const settings = await SystemSettingsModel.findOne({});
  if (!settings) {
    await SystemSettingsModel.create({
      wagePerBoy: 500,
      updatedAt: new Date(),
    });
    console.log("Default system settings created");
  }
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODBURL ?? "", {
      autoIndex: false,
    });
    console.log("Database connected");
    await initializeSystemSettings();
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
};
