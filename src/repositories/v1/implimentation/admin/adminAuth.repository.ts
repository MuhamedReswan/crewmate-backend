import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import IAdmin from "../../../../entities/v1/adminEntity";
import { BaseRepository } from "../base/base.repository";
import { IAdminAuthRepository } from "../../interfaces/admin/IAdminAuth.repository";

@injectable()
export default class AdminAuthRepository extends BaseRepository<IAdmin> implements IAdminAuthRepository  {
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