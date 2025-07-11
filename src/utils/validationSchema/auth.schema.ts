
import * as z from 'zod';
import { Role } from '../../constants/Role';

//Singup validation 
export const signupSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" })
    .trim(),
  
  email: z.string()
    .email({ message: "Invalid email address" }),
  
  mobile: z.string()
    .regex(/^[0-9]{10}$/, { message: "Mobile number must be exactly 10 digits" }),
  
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and special character"
    }),
  
  confirmPassword: z.string().optional(),
  
  terms: z.boolean().refine(val => val === true, { 
    message: "You must agree to the terms and conditions" 
  }).optional()
});


// Login validation
export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim(),
  
  password: z.string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and special character"
    }),

  rememberMe: z.boolean().optional().default(false)
});

// Forgot password validation
export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim(),
    role: z.nativeEnum(Role).optional()
});

// Password reset validation
export const resetpasswordSchema = z.object({
  password: z.string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and special character"
    }),
    token: z.string()
    .min(1,{message:"invalid token"}).trim(),
    email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim(),
});


// Types for each schema
export type signUpDto = z.infer<typeof signupSchema>;
export type loginDto = z.infer<typeof loginSchema>;
export type forgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type passwordDto = z.infer<typeof resetpasswordSchema>;