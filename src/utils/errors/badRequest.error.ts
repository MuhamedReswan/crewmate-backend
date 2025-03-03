import { CustomError } from "./custom.error";

export class BadrequestError extends CustomError {
    statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
  
   serializeErrors() {
    return {message:this.message, name:this.name};
  }
}