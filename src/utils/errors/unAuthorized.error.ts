import { CustomError } from "./custom.error";

export class UnAuthorizedError extends CustomError {
    statusCode: number = 401;
    constructor(message: string){
        super(message);
        this.name = "UnAuthorizedError";
    }

    serializeErrors(): { message: string; name: string; } {
        return {message: this.message, name: this.name};
    }
}