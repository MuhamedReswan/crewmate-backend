
import { CustomError } from "./custom.error";

export class NotFoundError extends CustomError{
    statusCode=404;
    constructor(message:string = "Resource Not Found"){
        super(message);
        this.name = "NotFoundError";
    }

    serializeErrors(): { message: string; name: string; } {
        return {message : this.message, name :this.name};
    }
}