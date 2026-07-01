import { Schema } from "mongoose";

export const ImageSchema = new Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

export const SecureImageSchema = new Schema(
  {
    publicId: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);
