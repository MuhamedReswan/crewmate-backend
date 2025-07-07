import { ServiceBoyLoginDTO } from "../dtos/v1/serviceBoy.dto";
import IServiceBoy from "../entities/v1/serviceBoyEntity";


export const mapToServiceBoyLoginDTO = (entity: IServiceBoy): ServiceBoyLoginDTO => ({
  _id: entity._id.toString(),
  name: entity.name,
  email: entity.email,
  isVerified: entity.isVerified,
  isBlocked: entity.isBlocked,
  role: entity.role,
});

