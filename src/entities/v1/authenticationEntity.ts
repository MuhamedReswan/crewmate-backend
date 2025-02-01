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
  
  export type LoginResponse<T, K extends string = "user"> = {
    [key in K]: T;
  } & BaseTokenResponse;
