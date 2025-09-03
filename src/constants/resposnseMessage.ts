export enum ResponseMessage {
  REGISTER_SUCCESS = "Registered successfully",
  LOGIN_SUCCESS = "Login succesful",
  EMAIL_ALREADY_USED = "Email is already in use",
  EMAIL_ALREADY_VERIFIED = "Email already verified",
  USER_NOT_FOUND = "User not found with this email",
  USER_NOT_CREATED = "User not created",
  INVALID_CREDINTIALS = "Invalid credintials",
  INVALID_INPUT = "Invalid input",

  OTP_EXPIRED = "OTP expired",
  OTP_VERIFICATION_SUCCESS = "OTP verification Success",
  RESEND_OTP_SEND = "OTP resend successfully",
  INVALID_OTP = "Invalid OTP",

  NO_REFRESH_TOKEN = "No refresh token",
  ACCESS_TOKEN_SET = "Access token set successfully",
  TOKEN_SET_SUCCESS = "Token set succesfully",
  INVALID_REFRESH_TOKEN = "Invalid or expired refresh token",
  INVALID_ACCESS_TOKEN = "Invalid access token",
  BLACK_LISTED_TOKEN = "Refresh token is blacklisted",

  LOGOUT_SUCCESS = "logout success",

  GOOGLE_REGISTER_SUCCESS = "Google register success",
  GOOGLE_REGISTER_FAILED = "Google register failed",

  FORGOT_PASSWORD_TOKEN_NOTFOUND = "Forgot token not found",
  FORGOT_PASSWORD_LINK_SEND = "Forgot Password Link sended to your email Please Verify",
  FORGOT_PASSWORD_TOKEN_EXPIRED = "Reset password token expired",
  INVALID_FORGOT_PASSWORD_TOKEN = "invalid forgot password token",
  RESET_PASSWORD_SUCCESS = "Password changed successfully",

  LOGIN_VERIFICATION_FAILED = "Login failed",
GOOGLE_AUTH_FAILED = "Authentication failed",
USE_GOOGLE_AUTH = "Account was created using Google. Please use Google Sign-In.",

VALIDATION_FAILED = "server side validation failed",
USER_BLOCKED_BY_ADMIN = "User is blocked by admin",

INTERNAL_SERVER_ERROR = "Internal server error",

PROFILE_UPDATED = "Profile updated successfully",
PROFILE_UPDATION_FAILED = "Profile updation failed",

ADMIN_CREDENTIAL_FAILED_TO_SET = "Admin credentials are not set in environment variables",
ADMIN_CREDENTIALS_NOT_CONFIGURED = "Admin credentials not configured",

LOAD_PROFILE_SUCCESS = "Load profile success",
IMAGE_URL_SUCCESS = "Image url fetched success",
IMAGE_URL_FAILED = "wrong key for image",

LOAD_VERIFICATION_SUCCESS = "Load verification success",
NO_VERIFICATION_STATUS = "No verifaction status found to update",
VERIFICATION_STATUS_UPDATE_SUCCESS = "Verification success",
LOAD_SERVICE_BOY_SUCCESS = "ServiceBoy loading success",
LOAD_VENDOR_SUCCESS = "Vendor loading success",
LOAD_USER_PROFILE_SUCCESS = "User profile loading success",
NO_USER_TO_VERIFY_WITH_THIS = "No user found to verify with this",

UPDATE_STATUS_SUCCESS = "Status updated success"




}
