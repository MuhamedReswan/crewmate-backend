import { Types } from "mongoose";
import { LocationData } from "../../types/type";

export default interface IEvent extends Document {
  _id: Types.ObjectId;
  customerName: String;
  vendorId: Types.ObjectId;
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
  // eventDate: Date;
  // reportingTime: String;
  reportingDateTime: Date;
  noOfPax: Number;
  travelExpense:Number;
  bookedBoysForFriends:Types.ObjectId[]
  bonus: Number;
}