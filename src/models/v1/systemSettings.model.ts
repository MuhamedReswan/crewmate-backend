import mongoose, { Schema } from "mongoose";

const SystemSettingsSchema = new Schema({
  wagePerBoy: { type: Number, required: true, default: 500 }, 
  updatedAt: { type: Date, default: Date.now }
});

export const SystemSettingsModel = mongoose.model("SystemSettings", SystemSettingsSchema);
