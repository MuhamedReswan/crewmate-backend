import { ObjectId } from "mongodb";
import { Types } from "mongoose";

// Reusable helper
function validateObjectId(id: string): boolean {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

export default validateObjectId;