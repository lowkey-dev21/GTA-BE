// Email Verification Template
export const emailVerificationTemplate = {
  subject: "Verify your email",
  text: ` verify your email`,
  html: `<head>
        <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - GTA</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .email-container {
              background-color: #ffffff;
              margin: 40px auto;
              padding: 20px;
              max-width: 600px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              background-color:  #007bff;
              padding: 20px;
              text-align: center;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
          }
          .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
              text-align: center;
          }
          .content h2 {
              color: #333333;
          }
          .content h1 {
              font-size: 16px;
              color: #666666;
          }
          .codeBg {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              background-color:  #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 18px;
          }
  
          .codeBg h1 {
              color: #ffffff; /* Ensures the code text is white */
              margin: 0;
              font-size: 24px;
          }
  
          .footer {
              padding: 20px;
              background-color: #f4f4f4;
              text-align: center;
              font-size: 14px;
              color: #888888;
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;
          }
      </style>
  </head>
  <body>
  
      <div class="email-container">
          <div class="header">
              <h1>Welcome to GTA</h1>
          </div>
  
          <div class="content">
              <h2>Email Verification</h2>
              <p>Hi {username},</p>
              <p>Thank you for signing up with GTA! To complete your registration, please verify your email address by clicking the button below:</p>
              <p>Your verification Code is :</p>
              <div class="codeBg" >
              <h1 >{verificationToken}</h1>
              </div>
  
          </div>
  
          <div class="footer">
              <p>If you did not create an account with GTA, please ignore this email.</p>
              <p>&copy; 2024 Gabriel Trading Academy. All Rights Reserved.</p>
          </div>
      </div>
  
  </body>`,
};

// Welcome Email Template
export const welcomeEmailTemplate = {
  subject: "Welcome to GTA!",
  text: `Hi {username}, welcome to GTA! We're excited to have you onboard.`,
  html: `
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to GTA</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                background-color: #ffffff;
                margin: 40px auto;
                padding: 20px;
                max-width: 600px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #007bff;
                padding: 20px;
                text-align: center;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }
            .header h1 {
                color: #ffffff;
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content h2 {
                color: #333333;
                font-size: 20px;
            }
            .content p {
                font-size: 16px;
                color: #666666;
                margin: 10px 0;
            }
            .welcome-btn {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
            }
            .footer {
                padding: 20px;
                background-color: #f4f4f4;
                text-align: center;
                font-size: 14px;
                color: #888888;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Welcome to GTA!</h1>
            </div>
            <div class="content">
                <h2>Hello, {username}!</h2>
                <p>Thank you for joining Gabriel Trading Academy (GTA). We're excited to have you as part of our community where you'll gain valuable insights into trading and more.</p>
                <p>To get started, click the button below and explore what we have in store for you!</p>
                <a href="{clientURL}" class="welcome-btn">Explore Now</a>
            </div>
            <div class="footer">
                <p>&copy; 2024 Gabriel Trading Academy. All Rights Reserved.</p>
            </div>
        </div>
    </body>
  `,
};

// reset password link
export const resetPasswordTemplate = {
  subject: "Reset Your Password",
  text: `Reset your password`,
  html: `<head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password - GTA</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .email-container {
              background-color: #ffffff;
              margin: 40px auto;
              padding: 20px;
              max-width: 600px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              background-color: #007bff;
              padding: 20px;
              text-align: center;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
          }
          .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
              text-align: center;
          }
          .content h2 {
              color: #333333;
          }
          .content p {
              color: #666666;
              font-size: 16px;
          }
          .reset-button {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 18px;
          }
          .footer {
              padding: 20px;
              background-color: #f4f4f4;
              text-align: center;
              font-size: 14px;
              color: #888888;
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;
          }
      </style>
  </head>
  <body>

      <div class="email-container">
          <div class="header">
              <h1>Password Reset Request</h1>
          </div>

          <div class="content">
              <h2>Hello {username},</h2>
              <p>We received a request to reset your password for your GTA account.</p>
              <p>Please click the button below to reset your password:</p>
              <a href="{resetLink}" class="reset-button math-inline ">Reset Password</a>
              <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>

          <div class="footer">
              <p>&copy; 2024 Gabriel Trading Academy. All Rights Reserved.</p>
          </div>
      </div>

  </body>`,
};

// password changed successfully template
export const passwordChangedTemplate = {
  subject: "Password Changed Successfully",
  text: `Your password has been changed successfully.`,
  html: `<head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed - GTA</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .email-container {
              background-color: #ffffff;
              margin: 40px auto;
              padding: 20px;
              max-width: 600px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              background-color: #007bff;
              padding: 20px;
              text-align: center;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
          }
          .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
              text-align: center;
          }
          .content h2 {
              color: #333333;
          }
          .content p {
              color: #666666;
              font-size: 16px;
          }
          .success-icon {
              display: inline-block;
              width: 50px;
              height: 50px;
              background-color: #28a745; /* Green background */
              border-radius: 50%;
              line-height: 50px;
              font-size: 30px;
              color: #ffffff;
              margin-bottom: 20px;
          }
          .footer {
              padding: 20px;
              background-color: #f4f4f4;
              text-align: center;
              font-size: 14px;
              color: #888888;
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;
          }
      </style>
  </head>
  <body>

      <div class="email-container">
          <div class="header">
              <h1>Password Changed Successfully</h1>
          </div>

          <div class="content">
              <div class="success-icon">✔</div>
              <h2>Hello {username},</h2>
              <p>Your password has been changed successfully for your GTA account.</p>
              <p>If you did not initiate this change, please contact our support team immediately.</p>
          </div>

          <div class="footer">
              <p>&copy; 2024 Gabriel Trading Academy. All Rights Reserved.</p>
          </div>
      </div>

  </body>`,
};

// profile updated template
export const profileUpdatedTemplate = {
  subject: "Profile Updated",
  text: `Your profile has been updated.`,
  html: `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile Updated - GTA</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
      }
      .email-container {
          background-color: #ffffff;
          margin: 40px auto;
          padding: 20px;
          max-width: 600px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
          background-color: #007bff;
          padding: 20px;
          text-align: center;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
      }
      .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
      }
      .content {
          padding: 20px;
          text-align: center;
      }
      .content h2 {
          color: #333333;
      }
      .content p {
          color: #666666;
          font-size: 16px;
      }
      .info-icon {
          display: inline-block;
          width: 50px;
          height: 50px;
          background-color: #17a2b8; /* Info background */
          border-radius: 50%;
          line-height: 50px;
          font-size: 30px;
          color: #ffffff;
          margin-bottom: 20px;
      }
      .footer {
          padding: 20px;
          background-color: #f4f4f4;
          text-align: center;
          font-size: 14px;
          color: #888888;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
      }
  </style>
</head>
<body>

  <div class="email-container">
      <div class="header">
          <h1>Profile Updated Successfully</h1>
      </div>

      <div class="content">
          <div class="info-icon">ℹ️</div>
          <h2>Hello {firstName},</h2>
          <p>Your profile has been updated successfully. Below are your updated details:</p>
          <p><strong>Username: </strong>{username}</p>
       
          <p>If you did not make these changes, please contact our support team immediately.</p>
      </div>

      <div class="footer">
          <p>&copy; 2024 Gabriel Trading Academy. All Rights Reserved.</p>
      </div>
  </div>

</body>
`,
};
