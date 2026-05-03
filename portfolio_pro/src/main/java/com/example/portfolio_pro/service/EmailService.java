package com.example.portfolio_pro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        // Who the email is going to
        message.setTo(toEmail);
        
        // The subject line
        message.setSubject("PortfolioPro - Password Reset Code");
        
        // The actual email content
        message.setText("Hello,\n\n"
                + "You have requested to reset your password. Here is your 6-digit verification code:\n\n"
                + ">> " + otp + " <<\n\n"
                + "This code will expire in 15 minutes.\n"
                + "If you did not request this, please ignore this email.");

        // Send it!
        mailSender.send(message);
    }
}