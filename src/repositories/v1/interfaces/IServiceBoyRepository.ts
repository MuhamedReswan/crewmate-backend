export interface IServiceBoyRepository{
    findServiceBoyByEmail(email:string):Promise<any>;
    createServiceBoy(serviceBoyData:any):Promise<any>;


}