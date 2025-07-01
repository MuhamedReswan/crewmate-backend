import { ServiceBoyLoginDTO } from "../dtos/serviceBoy.dto";
import IServiceBoy from "../entities/v1/serviceBoyEntity"; 

export const mapToServiceBoyLoginDTO = (entity: IServiceBoy): ServiceBoyLoginDTO => ({
  _id: entity._id,
  name: entity.name,
  email: entity.email,
  isVerified: entity.isVerified,
  isBlocked: entity.isBlocked,
  role: entity.role,
});

