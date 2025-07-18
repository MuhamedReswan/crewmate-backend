import { CustomError } from "./custom.error";

export class ValidationError extends CustomError{
    statusCode: number = 403;
    constructor(message: string){
        super(message);
        this.name = 'validationError';
    }

serializeErrors(){
    return {message:this.message, name:this.name};
    }
}