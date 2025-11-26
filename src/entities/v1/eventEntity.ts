import { Types } from "mongoose";
import { LocationData } from "../../types/type";

export default interface IEvent extends Document {
  _id: Types.ObjectId;
  customerName: String;
  vendor: Types.ObjectId;
  typeOfWork: String;
  typeOfService: String;
  serviceBoys: number;
  eventLocation: LocationData;
  bookedBoys: number;
  status: String;
  wagePerBoy:number;
  paymentStatus: String;
  bookings: Types.ObjectId[];
  overTime: number;
  totalBill: number;
  ratings: Types.ObjectId[];
  reportingDateTime: Date;
  noOfPax: number;
  travelExpense:number;
  bookedBoysForFriends:Types.ObjectId[]
  bonus: number;
}