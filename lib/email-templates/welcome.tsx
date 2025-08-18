// Welcome Email Template
// This would be used with your email service (SendGrid, Resend, etc.)

export interface WelcomeEmailProps {
  userName?: string
  userEmail: string
  pupName: string
  loginUrl: string
}

export function generateWelcomeEmail({ userName, userEmail, pupName, loginUrl }: WelcomeEmailProps) {
  const name = userName || "Dog Lover"
  
  return {
    subject: `Welcome to DOGGIT, ${name}! 🐕`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to DOGGIT</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: white;
              border-radius: 10px;
              padding: 40px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo img {
              width: 80px;
              height: auto;
            }
            h1 {
              color: #2E005D;
              font-size: 28px;
              text-align: center;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background-color: #2E005D;
              color: white !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #4A0090;
            }
            .checklist {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .checklist h3 {
              color: #2E005D;
              margin-top: 0;
            }
            .checklist ul {
              list-style: none;
              padding: 0;
            }
            .checklist li {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .checklist li:last-child {
              border-bottom: none;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .info-box {
              background-color: #F3E5FF;
              border-left: 4px solid #2E005D;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="${process.env.NEXT_PUBLIC_APP_URL}/doggit-logo-mark.svg" alt="DOGGIT Logo">
            </div>
            
            <h1>Welcome to DOGGIT, ${name}! 🎉</h1>
            
            <p>We're thrilled to have you and <strong>${pupName}</strong> join the DOGGIT family!</p>
            
            <p>Your journey to becoming an amazing dog parent starts now. We've prepared everything you need to succeed.</p>
            
            <div class="info-box">
              <strong>Your Account Details:</strong><br>
              Email: ${userEmail}<br>
              Login URL: ${loginUrl}
            </div>
            
            <div style="text-align: center;">
              <a href="${loginUrl}" class="button">Start Training Now</a>
            </div>
            
            <div class="checklist">
              <h3>🚀 Quick Start Guide:</h3>
              <ul>
                <li>✓ Watch "Puppy Basics" first (15 minutes)</li>
                <li>✓ Set up your training schedule</li>
                <li>✓ Join our community forum</li>
                <li>✓ Download the mobile app for training on-the-go</li>
                <li>✓ Track ${pupName}'s progress daily</li>
              </ul>
            </div>
            
            <h3>📱 Get the Mobile App</h3>
            <p>Train anywhere with our mobile app. Download it from the App Store or Google Play to access your videos offline!</p>
            
            <h3>💬 Need Help?</h3>
            <p>Our support team is here for you! Reply to this email or visit our help center anytime.</p>
            
            <div class="footer">
              <p>Happy Training!<br>
              The DOGGIT Team</p>
              
              <p style="font-size: 12px; color: #999;">
                P.S. Save this email for your login information.<br>
                You're receiving this because you signed up for DOGGIT.<br>
                © 2024 DOGGIT. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to DOGGIT, ${name}!

We're thrilled to have you and ${pupName} join the DOGGIT family!

Your journey to becoming an amazing dog parent starts now. We've prepared everything you need to succeed.

YOUR ACCOUNT DETAILS:
Email: ${userEmail}
Login URL: ${loginUrl}

QUICK START GUIDE:
✓ Watch "Puppy Basics" first (15 minutes)
✓ Set up your training schedule
✓ Join our community forum
✓ Download the mobile app for training on-the-go
✓ Track ${pupName}'s progress daily

Start Training Now: ${loginUrl}

Need Help?
Our support team is here for you! Reply to this email or visit our help center anytime.

Happy Training!
The DOGGIT Team

P.S. Save this email for your login information.
    `
  }
}

// Example usage with email service:
/*
import { sendEmail } from '@/lib/email-service'
import { generateWelcomeEmail } from '@/lib/email-templates/welcome'

const emailContent = generateWelcomeEmail({
  userName: "Sarah",
  userEmail: "sarah@example.com",
  pupName: "Max",
  loginUrl: "https://doggit.app/login"
})

await sendEmail({
  to: "sarah@example.com",
  ...emailContent
})
*/