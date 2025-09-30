import { CustomError } from "./custom.error";

export class ConflictError extends CustomError {
    statusCode: number = 409; 

    constructor(message: string = "Resource already exists") {
        super(message);
        this.name = "ConflictError";
    }

    serializeErrors() {
        return { message: this.message, name: this.name };
    }
}
