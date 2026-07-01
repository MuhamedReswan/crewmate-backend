import { Types } from "mongoose";

import { BookingStatusType, EventStatusType } from "../../constants/status";
import { LocationData } from "../../types/type";

export default interface IEvent extends Document {
  _id: Types.ObjectId;
  customerName: string;
  vendor: Types.ObjectId;
  typeOfWork: string;
  typeOfService: string;
  serviceBoys: number;
  eventLocation: LocationData;
  status: EventStatusType;
  wagePerBoy: number;
  paymentStatus: string;
  overTime: number;
  totalBill: number;
  ratings: Types.ObjectId[];
  reportingDateTime: Date;
  noOfPax: number;
  bonus: number;
  travelExpense: number;
  bookedBoys: number;
  bookings: Types.ObjectId[];
  bookingStatus: BookingStatusType;
  bookedBoysForFriends: Types.ObjectId[];
}
