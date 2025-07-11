import { Role } from "../../constants/Role";

export default interface IAdmin {
_id:string;
email: string;
password?: string;
name:string;
role:Role;
}