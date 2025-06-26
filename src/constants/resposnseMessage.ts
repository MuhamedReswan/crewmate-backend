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

  LOGOUT_SUCCESS = "logout success",

  GOOGLE_REGISTER_SUCCESS = "Google register success",
  GOOGLE_REGISTER_FAILED = "Google register failed",

  FORGOT_PASSWORD_TOKEN_NOTFOUND = "Forgot token not found",
  FORGOT_PASSWORD_LINK_SEND = "Forgot Password Link sended to your email Please Verify",
  FORGOT_PASSWORD_TOKEN_EXPIRED = "Reset password token expired",
  INVALID_FORGOT_PASSWORD_TOKEN = "invalid forgot password token",
  RESET_PASSWORD_SUCCESS = "Password changed successfully",

GOOGLE_AUTH_FAILED = "Authentication failed",

VALIDATION_FAILED = "server side validation failed",
USER_BLOCKED_BY_ADMIN = "User is blocked by admin",

INTERNAL_SERVER_ERROR = "Internal server error",

PROFILE_UPDATED = "Profile updated successfully",
PROFILE_UPDATION_FAILED = "Profile updation failed",
}
