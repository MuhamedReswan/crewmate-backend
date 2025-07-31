import IAdmin from "../../../../entities/v1/adminEntity";

export interface IAdminAuthRepository {
findByEmail (email:Partial<IAdmin>):Promise<IAdmin | null>
}