import IVendor from "../entities/v1/vendorEntity";
import { VendorLoginDTO } from "../dtos/v1/vendor.dto";

export const mapToVendorLoginDTO = (entity: IVendor): VendorLoginDTO => ({
  _id: entity._id.toString(),
  name: entity.name,
  email: entity.email,
  isVerified: entity.isVerified,
  isBlocked: entity.isBlocked,
  role: entity.role,
  rejectionReason:entity.rejectionReason ? entity.rejectionReason : null
});