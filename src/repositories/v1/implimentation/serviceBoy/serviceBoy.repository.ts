import { inject, injectable } from "tsyringe";
import { BaseRepository } from "../base/base.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { Model } from "mongoose";


export interface IServiceBoyRepository{
  updateProfile(id:Partial<IServiceBoy>, data: Partial<IServiceBoy>): Promise<IServiceBoy | undefined>
}

@injectable()
export default class ServiceBoyRepository extends BaseRepository<IServiceBoy> implements IServiceBoyRepository{
     constructor(@inject('ServiceBoyModel')  model: Model<IServiceBoy>) {
    super(model);
  }

  async updateProfile(_id:Partial<IServiceBoy>,data: Partial<IServiceBoy>): Promise<IServiceBoy | undefined> {
    try {
      console.log("id from serviceboy repository",_id);

const updatedProfile = await this.updateOne(_id ,data);
console.log("updatedProfile-----------------",updatedProfile);
      console.log("data", data);

      if(updatedProfile){
        return updatedProfile;
      }
      return;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
}