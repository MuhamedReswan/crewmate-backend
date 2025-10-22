import { Types } from "mongoose";
import { LocationData } from "../../types/type";

export default interface IEvent extends Document {
  _id: Types.ObjectId;
  customerName: String;
  vendor: Types.ObjectId;
  typeOfWork: String;
  typeOfService: String;
  serviceBoys: Number;
  eventLocation: LocationData;
  bookedBoys: Number;
  status: String;
  paymentStatus: String;
  bookings: Types.ObjectId[];
  overTime: Number;
  totalBill: Number;
  ratings: Types.ObjectId[];
  reportingDateTime: Date;
  noOfPax: Number;
  travelExpense:Number;
  bookedBoysForFriends:Types.ObjectId[]
  bonus: Number;
}