exports.registrationTemplate = (name, email, otp, expireDate, verifyEmailLink) => {
  return `
  <!DOCTYPE html>
  <html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirm Your Email</title>
    <style>
      body {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 520px;
        background-color: #ffffff;
        margin: 50px auto;
        border-radius: 14px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        padding: 30px 20px;
        text-align: center;
      }
      .header h2 {
        margin: 0;
        font-size: 26px;
        letter-spacing: 1.5px;
      }
      .content {
        padding: 30px 25px;
        text-align: center;
      }
      .content h3 {
        margin-top: 0;
        font-size: 18px;
        color: #111827;
      }
      .content p {
        font-size: 15px;
        color: #4b5563;
        line-height: 1.7;
        margin: 10px 0 25px 0;
      }
      .otp-box {
        background-color: #e0e7ff;
        display: inline-block;
        padding: 12px 25px;
        border-radius: 8px;
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 2px;
        color: #1e3a8a;
        margin-bottom: 20px;
      }
      .btn {
        display: inline-block;
        background-color: #2563eb;
        color: #fff;
        padding: 12px 30px;
        border-radius: 30px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
      }
      .btn:hover {
        background-color: #1d4ed8;
      }
      .footer {
        background-color: #f9fafb;
        padding: 20px 15px;
        font-size: 13px;
        color: #6b7280;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      }
      .footer a {
        color: #2563eb;
        text-decoration: none;
        margin: 0 4px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h2>CONFIRM YOUR EMAIL</h2>
      </div>

      <div class="content">
        <h3>Dear ${name},</h3>
        <p>
          We’ve received your registration information for 
          <strong>${email}</strong>.<br />
          Please use the OTP below to verify your email address and complete your registration.
        </p>

        <div class="otp-box">${otp}</div>

        <p>
          Or, you can verify directly by clicking the button below.
        </p>

        <a href="${verifyEmailLink}" class="btn">Verify Email →</a>

        <p style="margin-top: 25px;">
          This OTP will expire on <strong>${new Date(expireDate)}</strong>.<br>
          If you did not make this request, please ignore this email.  
          No further action will be taken.
        </p>
      </div>

      <div class="footer">
        <p>Best regards, <strong>Your Company</strong></p>
        <p>2912 Lost Prairie, Kittitas, New Jersey<br>
          Phone: <a href="tel:+909123456789">+909 123 456 789</a>
        </p>
        <p>
          <a href="#">Update</a> | <a href="#">Unsubscribe</a>
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
};
