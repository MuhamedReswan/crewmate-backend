import IAdmin from "../../../../entities/v1/adminEntity";

export interface IAdminRepository {
findByEmail (email:Partial<IAdmin>):Promise<IAdmin | null>
}