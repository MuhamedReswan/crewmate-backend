export enum ResponseMessage {
    REGISTER_SUCCESS = "Registered successfully",
    LOGIN_SUCCESS = "Login succesful",
    EMAIL_ALREADY_USED = "Email is already in use",
    EMAIL_ALREADY_VERIFIED = "Email already verified",
    NO_SERVICE_BOY_WITH_EMAIL = "Service boy not found with the provided email",
    SERVICE_BOY_NOTFOUND = "Service boy not found",

    OTP_EXPIRED = "OTP expired",
    OTP_VERIFICATION_SUCCESS = "OTP verification Success",
    RESEND_OTP_SEND = "Resend otp sended",
    INVALID_OTP = "Invalid OTP",

    NO_REFRESH_TOKEN="No refresh token",
    ACCESS_TOKEN_SET ="Access token set successfully",
    INVALID_REFRESH_TOKEN = "Invalid or expired refresh token",
    
    GOOGLE_REGISTER_SUCCESS = "Google register success",
    GOOGLE_REGISTER_FAILED = "Google register failed",
    
    FORGOT_PASSWORD_LINK_SEND = "Forgot Password Link sended to your email Please Verify",
    RESET_PASSWORD_TOKEN_EXPIRED = "Reset password token expired",
    PASSWORD_RESET_SUCCESS = "Password reset successfully",
    INVALID_RESET_PASSWORD_TOKEN = "invalid reset password token",
    RESET_PASSWORD_SUCCESS = "Password changed successfully"


}