export enum ResponseMessage {
    REGISTER_SUCCESS = "Registered successfully",
    OTP_VERIFICATION_SUCCESS = "OTP verification Success",
    EMAIL_ALREADY_VERIFIED = "Email already verified",
    EMAIL_ALREADY_USED = "Email is already in use",
    LOGIN_SUCCESS = "Login succesful",
    RESEND_OTP_SEND = "Resend otp sended",
    NO_REFRESH_TOKEN="No refresh token",
    ACCESS_TOKEN_SET ="Access token set successfully",
    INVALID_REFRESH_TOKEN = "Invalid or expired refresh token",
    NO_SERVICE_BOY_WITH_EMAIL = "Service boy not found with the provided email",
    FORGOT_PASSWORD_LINK_SEND = "Forgot Password Link sended to your email PleaseVerify",
    SERVICE_BOY_NOTFOUND = "Service boy not found",
    PASSWORD_RESET_SUCCESS = "Password reset successfully",
    RESET_PASSWORD_TOKEN_EXPIRED = "Reset password token expired",
    INVALID_RESET_PASSWORD_TOKEN = "invalid reset password token",
    GOOGLE_REGISTER_SUCCESS = "Google register success",
    GOOGLE_REGISTER_FAILED = "Google register failed",
    RESET_PASSWORD_SUCCESS = "Password changed successfully"


}