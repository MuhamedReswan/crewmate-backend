import { VerificationStatusType } from "../../../../constants/status";
import { VendorLoginDTO } from "../../../../dtos/v1/vendor.dto";
import IVendor from "../../../../entities/v1/vendorEntity";
import { ImageFiles } from "../../../../types/type";

export interface IVendorService {
  updateVendorProfile: (body: Partial<IVendor>, files: ImageFiles) => Promise<IVendor | undefined>;
   loadVendorProfile (_id:Partial<IVendor>):Promise<IVendor | undefined> 
   retryVerification (_id:Partial<IVendor>,isVerified:VerificationStatusType):Promise<IVendor | undefined> 
   loadVendorById (_id:Partial<IVendor>):Promise<VendorLoginDTO | undefined> 
}