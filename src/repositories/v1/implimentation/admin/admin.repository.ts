import { inject, injectable } from "tsyringe";
import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";
import { Model, model } from "mongoose";
import IAdmin from "../../../../entities/v1/adminEntity";
import { BaseRepository } from "../base/base.repository";

@injectable()
export default class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository  {
 constructor(@inject("AdminModel") model: Model<IAdmin>){
super(model);
 }   

 async findByEmail (email:Partial<IAdmin>): Promise<IAdmin | null>{
    try {
      const adminDetails =  await this.findOne(email);
      return adminDetails;
    } catch (error) {
        throw error;
    }
 }
}