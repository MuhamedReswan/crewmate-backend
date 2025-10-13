import { Schema } from "mongoose";

const FriendBookingSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  bookedByServiceBoyId: { type: Schema.Types.ObjectId, ref: "ServiceBoy", required: true }, // Who booked the friend
  friendId: { type: Schema.Types.ObjectId, ref: "ServiceBoy", required: true }, // Friend being booked
  friendVerified: { type: Boolean, default: false },
  bookingStatus: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
