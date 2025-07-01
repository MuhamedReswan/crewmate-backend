import { ServiceBoyLoginDTO } from "../../dtos/serviceBoy.dto";
import IServiceBoy from "./serviceBoyEntity";
import IVendor from "./vendorEntity";

 export interface Register {
    name?:string,
    email:string,
    password?:string,
    profileImage?:string
    mobile?:string
}

export interface BaseTokenResponse {
    accessToken: string;
    refreshToken: string;
  }

  export interface GoogleLogin {
    googleToken:string
  }

  export  interface ServiceBoyLoginResponse {
    serviceBoy: ServiceBoyLoginDTO; 
    accessToken: string;
    refreshToken: string;
  }
  export  interface VendorLoginResponse {
    vendor: IVendor; 
    accessToken: string;
    refreshToken: string;
  }

    export interface IResetPassword{
      email:string,
      forgotToken?:string
      password: string
    }
  
  
  export type LoginResponse<T, K extends string = "user"> = {
    [key in K]: T;
  } & BaseTokenResponse;
