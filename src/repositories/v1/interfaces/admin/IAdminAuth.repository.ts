import IAdmin from "../../../../entities/v1/adminEntity";

export interface IAdminAuthRepository {
findByEmail (email:string):Promise<IAdmin | null>
}