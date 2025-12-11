import { Types } from "mongoose";
import { LocationData } from "../../types/type";
import { BookingStatusType, EventStatusType } from "../../constants/status";

export default interface IEvent extends Document {
  _id: Types.ObjectId;
  customerName: String;
  vendor: Types.ObjectId;
  typeOfWork: String;
  typeOfService: String;
  serviceBoys: number;
  eventLocation: LocationData;
  status: EventStatusType;
  wagePerBoy:number;
  paymentStatus: String;
  overTime: number;
  totalBill: number;
  ratings: Types.ObjectId[];
  reportingDateTime: Date;
  noOfPax: number;
  bonus: number;
  travelExpense:number;
  bookedBoys: number;
  bookings: Types.ObjectId[];
  bookingStatus: BookingStatusType;
  bookedBoysForFriends:Types.ObjectId[]
}