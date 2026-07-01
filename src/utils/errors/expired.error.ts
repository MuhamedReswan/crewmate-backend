import { CustomError } from "./custom.error";

export class ExpiredError extends CustomError {
  statusCode = 410;
  constructor(message: string = "Resource is no longer available") {
    super(message);
    this.name = "ExpiredError";
  }

  serializeErrors(): { message: string; name: string } {
    return { message: this.message, name: this.name };
  }
}
