import { CustomError } from "./custom.error";

export class ValidationError extends CustomError{
    statusCode: number = 400;
    constructor(message: string){
        super(message);
        this.name = 'validationError'
    }

serializeErrors(){
    return {message:this.message, name:this.name};
    }
}