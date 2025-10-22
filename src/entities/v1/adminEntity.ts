import { Role } from "../../constants/Role";
import { LocationData } from "../../types/type";

export default interface IAdmin {
_id:string;
email: string;
password?: string;
name:string;
role:Role;
location:LocationData
}