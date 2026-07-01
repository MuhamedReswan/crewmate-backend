import { CustomError } from "./custom.error";

export class ForbiddenError extends CustomError {
  statusCode: number = 403;
  constructor(message: string = "Access denied") {
    super(message);
    this.name = "ForbiddenError";
  }

  serializeErrors() {
    return { message: this.message, name: this.name };
  }
}
