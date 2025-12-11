import mongoose, { Schema } from "mongoose";
import IEvents from "../../entities/v1/eventEntity";
import { LocationSchema } from "./location.model";
import { BookingStatus, EventStatus } from "../../constants/status";

// const EventsSchema: Schema = new Schema({
//   CustomerName: { type: String },
//   VendorId: { type: Schema.Types.ObjectId, unique: true },
//   TypeOfWork: { type: String, enum: [ 'Wedding', ' Reception', ' BirthDay Party', ' House Warming', ' Nikkah only', ' others' ] },
//   TypeOfService: { type: String, enum: [ 'Islamic Buffet', 'Buffet', 'Sitting', 'Hybrid'] },
//   NeededBoys: { type: Number },
//   Location: { type: String },
//   BookedBoys: { type: Number },
//   Status: { type: String, enum: [ 'Completed', ' Canceled', ' Pending' ] },
//   PaymentStatus: { type: String, enum: [ 'Pending', ' Paid' ] },
//   Bookings: { type: Schema.Types.ObjectId },
//   OverTime: { type: Number },
//   TotalBill: { type: Number },
//   Ratings: [{ type: Schema.Types.ObjectId,  }],
//   Date: { type: Date },
//   ReportingTime: { type: String },
//   NoOfPax: { type: Number },
//   Bonus: { type: Number },

// });


// const EventsSchema = new Schema<IEvents>({
//   customerName: { type: String, required: true },
//   vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
//   typeOfWork: { type: String, required: true },
//   typeOfService: { type: String, required: true },
//   serviceBoys: { type: Number, required: true },
//   eventLocation: {
//     lat: Number,
//     lng: Number,
//     address: String,
//   },
//   // bookedBoys: { type: Number, default: 0 },
//   status: { type: String, default: "pending" },
//   paymentStatus: { type: String, default: "unpaid" },
//   bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
//   overTime: { type: Number, default: 0 },
//   totalBill: { type: Number, default: 0 },
//   // ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
//   date: { type: Date, required: true },
//   reportingTime: { type: String, required: true },
//   noOfPax: { type: Number, default: 0 },
//   bonus: { type: Number, default: 0 },
// });



const EventsSchema = new Schema<IEvents>({
  customerName: { type: String, required: true },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendors", required: true },
  typeOfService: { type: String, required: true },
  typeOfWork: { type: String, required: true },
  noOfPax: { type: Number, required: true },
  reportingDateTime: { type: Date, required: true },
  serviceBoys: { type: Number, required: true },
  wagePerBoy: {type:Number, default:500},
  eventLocation: LocationSchema,
  status: { type: String, enum: Object.values(EventStatus), default: EventStatus.Upcoming, required: true, },
  bookingStatus: {type: String, enum: Object.values(BookingStatus), default: BookingStatus.Active, required: true,},
  overTime: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  travelExpense: { type: Number, default: 0 },
  totalBill: { type: Number, default: 0 },
  bookedBoys: [{ type: Schema.Types.ObjectId, ref: "ServiceBoys" }], 
  bookedBoysForFriends: [{ type: Schema.Types.ObjectId, ref: "FriendBooking" }],
}, { timestamps: true });

const eventModel = mongoose.model<IEvents>('Events', EventsSchema);

export default eventModel;