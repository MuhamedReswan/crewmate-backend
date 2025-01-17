export interface IServiceBoyService {
    register(name:string, email:string, password:string,mobile:string): Promise<void>
}