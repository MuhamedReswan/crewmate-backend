import nodemailer from 'nodemailer';
import { NODEMAILEREMAIL, NODEMAILERPASSWORD } from '../config/env';
import { BadrequestError } from './errors/badRequest.error';
import { Role } from '../constants/Role';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: NODEMAILEREMAIL,
        pass: NODEMAILERPASSWORD
    }
});

export const sendOtpEmail = async (email: string, otp: string) => {
  console.log("email from sendOtpEmail----",email);

  if (!email) {
    throw new BadrequestError("Email is required");
}
    const htmlContent = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your login</title>
      <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
    </head>
    <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
      <table role="presentation"
        style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
        <tbody>
          <tr>
            <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
              <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                <tbody>
                  <tr>
                    <td style="padding: 40px 0px 0px;">
                      <div style="text-align: left;">
                        <div style="padding-bottom: 20px;"><img src="https://i.ibb.co/Qbnj4mz/logo.png" alt="Company" style="width: 56px;"></div>
                      </div>
                      <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                        <div style="color: rgb(0, 0, 0); text-align: left;">
                          <h1 style="margin: 1rem 0">Verification code</h1>
                          <p style="padding-bottom: 16px">Please use the verification code below to sign in.</p>
                          <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp}</strong></p>
                          <p style="padding-bottom: 16px">The otp will expire after 1 minutes</p>
                         
                        </div>
                      </div>
                      <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                        
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
    `;

    const mailOptions = {
        from: NODEMAILEREMAIL,
        to: email,
        subject: "Your OTP",
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (err) {
        console.error('Error sending OTP email:', err);
        throw new BadrequestError('Error sending OTP email');
    }
};

export function createOtp(): string{
    return Math.floor(1000 + Math.random() * 9000).toString();
};


export const sendForgotPasswordLink = async (email:string, token:string, role:Role) =>{
  console.log("email from sendForgotPasswordLink----",email);
  console.log("token from sendForgotPasswordLink----",token);
  console.log("role from sendForgotPasswordLink----",role);

  if (!email) {
    throw new BadrequestError("Email is required");
}
let userRole;
if(role === Role.VENDOR){
  userRole = 'vendor';
} else if(role === Role.SERVICE_BOY){
  userRole = 'service-boy';
}

  const htmlContent = `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Crewmate Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .content {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color:#4B49AC;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="/api/placeholder/150/50" alt="Crewmate Logo" />
        </div>
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password for your Crewmate account. Click the button below to reset it:</p>
            
            <div style="text-align: center;">
                <a href="http://localhost:5173/${userRole}/reset-password/${token}/${email}" class="button">Reset Password</a>
            </div>
            
            <p>If you didn't request this password reset, you can safely ignore this email. The link will expire in 30 minutes.</p>
            
            <p>For security reasons, this password reset link can only be used once. If you need to reset your password again, please visit <a href="http://localhost:5173">Crewmate</a> and request another reset.</p>
            
            <p>Best regards,<br>The Crewmate Team</p>
        </div>
        <div class="footer">
            <p>This email was sent by Crewmate. Please do not reply to this email.</p>
            <p>© 2025 Crewmate. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    const mailOptions = {
      from: NODEMAILEREMAIL,
      to: email,
      subject: "Forgot password link",
      html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('email sent successfully');
} catch (err) {
    console.error('Error sending OTP email:', err);
    throw err;
}

};

