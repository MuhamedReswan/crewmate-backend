export enum VerificationStatus {
  Pending = "pending",
  Verified = "verified",
  Rejected = "rejected",
}


export enum BookingStatus {
  Active= "Active",
  Stopped = "Stopped",
  Cancelled = "Cancelled",
  Completed = "Completed"
}


export enum EventStatus {
  Pending = "Pending",    
  Upcoming = "Upcoming",   
  Ongoing = "Ongoing",   
  Completed = "Completed", 
  Cancelled = "Cancelled", 
}

export type EventStatusType = `${EventStatus}`;
export type BookingStatusType = `${BookingStatus}`;
export type VerificationStatusType = "pending" | "verified" | "rejected";