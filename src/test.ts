import { Request } from "express";

const testReq: Request = {} as any;
console.log(testReq.user); // TypeScript should allow this without error