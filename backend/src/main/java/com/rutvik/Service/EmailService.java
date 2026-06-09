package com.rutvik.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    // Your Windows absolute image path
    private static final String LOGO_IMAGE_PATH =
            "C:\\Users\\LENOVE\\3D Objects\\CryptoMart\\Frontend V1.1\\public\\images\\logo-bg.png";

    public void sendVerificationOtpEmail(String userEmail, String otp) throws MessagingException {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(userEmail);
        helper.setFrom("noreply@cryptomart.com");
        helper.setSubject("CryptoMart - Verify Your Account");

        String html = buildOtpEmailTemplate(otp);
        helper.setText(html, true);

        // Load image from Windows absolute path
        FileSystemResource logo = new FileSystemResource(new File(LOGO_IMAGE_PATH));
        helper.addInline("cryptomartLogo", logo);

        try {
            javaMailSender.send(mimeMessage);
            System.out.println("OTP sent to: " + userEmail);
        } catch (MailException e) {
            throw new MailSendException("Failed to send email");
        }
    }

    // ⭐ NEW METHOD: SEND FORGOT PASSWORD OTP EMAIL
    public void sendForgotPasswordOtp(String userEmail, String otp, String userName) throws MessagingException {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(userEmail);
        helper.setFrom("noreply@cryptomart.com");
        helper.setSubject("CryptoMart - Reset Your Password");

        String html = buildForgotPasswordEmailTemplate(otp, userName);
        helper.setText(html, true);

        // Load image from Windows absolute path
        FileSystemResource logo = new FileSystemResource(new File(LOGO_IMAGE_PATH));
        helper.addInline("cryptomartLogo", logo);

        try {
            javaMailSender.send(mimeMessage);
            System.out.println("Forgot password OTP sent to: " + userEmail);
        } catch (MailException e) {
            throw new MailSendException("Failed to send email");
        }
    }

    // ⭐ NEW METHOD: SEND PASSWORD RESET CONFIRMATION
    public void sendPasswordResetConfirmation(String userEmail, String userName) throws MessagingException {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(userEmail);
        helper.setFrom("noreply@cryptomart.com");
        helper.setSubject("CryptoMart - Password Changed Successfully");

        String html = buildPasswordResetConfirmationTemplate(userName);
        helper.setText(html, true);

        // Load image from Windows absolute path
        FileSystemResource logo = new FileSystemResource(new File(LOGO_IMAGE_PATH));
        helper.addInline("cryptomartLogo", logo);

        try {
            javaMailSender.send(mimeMessage);
            System.out.println("Password reset confirmation sent to: " + userEmail);
        } catch (MailException e) {
            System.out.println("Failed to send confirmation email: " + e.getMessage());
        }
    }

    private String buildOtpEmailTemplate(String otp) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset='UTF-8'>
                  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                </head>
                <body style="background:#f4f4f4; margin:0; padding:0; font-family:Arial;">
                
                <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;">
                
                  <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:40px;text-align:center;">
                    <img src='cid:cryptomartLogo' style="width:120px; margin-bottom:15px;" />
                    <h1 style="color:white; letter-spacing:2px; margin:0;">CRYPTOMART</h1>
                  </div>
                
                  <div style="padding:40px;text-align:center;">
                    <h2 style="color:#333;">🔐 Verify Your Account</h2>
                    <p style="color:#666;">Enter the OTP below to complete your verification:</p>
                
                    <div style="background:#667eea;color:#fff;font-size:34px;padding:20px;border-radius:10px;display:inline-block;letter-spacing:10px;">
                      """ + otp + """
                    </div>
                
                    <p style="color:#999;margin-top:20px;">⏰ Expires in <b>10 minutes</b></p>
                
                    <p style="color:#888;font-size:13px;margin-top:30px;">
                      Do not share this code with anyone. CryptoMart never asks for OTP.
                    </p>
                  </div>
                
                </div>
                
                </body>
                </html>
                """;
    }

    // ⭐ NEW TEMPLATE: FORGOT PASSWORD OTP EMAIL
    private String buildForgotPasswordEmailTemplate(String otp, String userName) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset='UTF-8'>
                  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                </head>
                <body style="background:#f4f4f4; margin:0; padding:0; font-family:Arial;">
                
                <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                
                  <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:40px;text-align:center;">
                    <img src='cid:cryptomartLogo' style="width:120px; margin-bottom:15px;" />
                    <h1 style="color:white; letter-spacing:2px; margin:0;">CRYPTOMART</h1>
                  </div>
                
                  <div style="padding:40px;text-align:center;">
                    <h2 style="color:#333;">🔑 Reset Your Password</h2>
                    <p style="color:#666;">Hi <b>""" + userName + """
                </b>,</p>
                    <p style="color:#666;">We received a request to reset your password. Use the OTP below:</p>
                
                    <div style="background:#667eea;color:#fff;font-size:34px;padding:20px;border-radius:10px;display:inline-block;letter-spacing:10px;margin:20px 0;">
                      """ + otp + """
                    </div>
                
                    <p style="color:#999;margin-top:20px;">⏰ This OTP expires in <b>10 minutes</b></p>
                
                    <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:15px;margin:20px 0;">
                      <p style="color:#856404;margin:0;font-size:14px;">
                        ⚠️ <b>Security Alert:</b> If you didn't request this, please ignore this email and secure your account.
                      </p>
                    </div>
                
                    <p style="color:#888;font-size:13px;margin-top:30px;">
                      Do not share this OTP with anyone. CryptoMart will never ask for your OTP.
                    </p>
                  </div>
                
                  <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #dee2e6;">
                    <p style="color:#6c757d;font-size:12px;margin:0;">
                      © 2025 CryptoMart. All rights reserved.
                    </p>
                  </div>
                
                </div>
                
                </body>
                </html>
                """;
    }

    // ⭐ NEW TEMPLATE: PASSWORD RESET CONFIRMATION
    private String buildPasswordResetConfirmationTemplate(String userName) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset='UTF-8'>
                  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                </head>
                <body style="background:#f4f4f4; margin:0; padding:0; font-family:Arial;">
                
                <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                
                  <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:40px;text-align:center;">
                    <img src='cid:cryptomartLogo' style="width:120px; margin-bottom:15px;" />
                    <h1 style="color:white; letter-spacing:2px; margin:0;">CRYPTOMART</h1>
                  </div>
                
                  <div style="padding:40px;text-align:center;">
                    <div style="background:#d4edda;border:2px solid #28a745;border-radius:50%;width:80px;height:80px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
                      <span style="font-size:48px;">✓</span>
                    </div>
                    
                    <h2 style="color:#333;">Password Changed Successfully!</h2>
                    <p style="color:#666;">Hi <b>""" + userName + """
                </b>,</p>
                    <p style="color:#666;">Your password has been changed successfully.</p>
                
                    <div style="background:#d1ecf1;border:1px solid #17a2b8;border-radius:8px;padding:15px;margin:20px 0;">
                      <p style="color:#0c5460;margin:0;font-size:14px;">
                        🔒 Your account is now secured with your new password.
                      </p>
                    </div>
                
                    <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:15px;margin:20px 0;">
                      <p style="color:#856404;margin:0;font-size:14px;">
                        ⚠️ If you didn't make this change, please contact our support immediately.
                      </p>
                    </div>
                
                    <a href="http://localhost:5173/signin" style="display:inline-block;background:#667eea;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;margin-top:20px;font-weight:bold;">
                      Login to Your Account
                    </a>
                
                  </div>
                
                  <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #dee2e6;">
                    <p style="color:#6c757d;font-size:12px;margin:0;">
                      © 2025 CryptoMart. All rights reserved.
                    </p>
                  </div>
                
                </div>
                
                </body>
                </html>
                """;
    }
}
