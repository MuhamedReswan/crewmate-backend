export const getVerificationEmailTemplate = (
  name: string,
  status: 'APPROVED' | 'REJECTED',
  reason?: string
): string => {
  const statusClass = status === 'APPROVED' ? 'status-success' : 'status-rejected';
  const reasonSection = reason
    ? `
    <div class="reason">
      <strong>Reason for rejection:</strong> ${reason}
    </div>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crewmate Account Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f3f3;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .logo img {
      display: inline-block;
      vertical-align: middle;
    }
    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: #5b6ad0;
      display: inline-block;
      vertical-align: middle;
    }
    .status-success {
      color: #28a745;
      font-weight: bold;
    }
    .status-rejected {
      color: #dc3545;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
    .reason {
      background-color: #f8d7da;
      color: #721c24;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://i.ibb.co/Qbnj4mz/logo.png" alt="Crewmate Logo" width="40">
      <span class="logo-text">CrewMate</span>
    </div>
    <h2>Account Verification Status</h2>
    <p>Hello ${name},</p>
    <p>Your Crewmate account has been 
      <span class="${statusClass}">
        ${status}
      </span>
      by the admin.
    </p>
    ${reasonSection}
    <p>Thank you for being a part of Crewmate!</p>
    <div class="footer">
      &copy; 2025 Crewmate. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
};
