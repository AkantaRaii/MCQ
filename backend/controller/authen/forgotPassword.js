const nodemailer = require("nodemailer");
const crypto = require("crypto");
const db = require("../../models/db");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",  // Host for Gmail
  port: 587,               // Use port 587 for TLS
  secure: false,           // Use false for non-SSL/TLS connections
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail address
    pass: process.env.EMAIL_PASS,  // Your 16-character App Password
  },
});


// Test the email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    const expirationTime = new Date().getTime() + 3600000; // 1 hour expiry

    db.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, expirationTime, email],
      (updateErr) => {
        if (updateErr) {
          console.error("Update Error:", updateErr);
          return res.status(500).json({ message: "Database error" });
        }

        const resetLink = `http://localhost:3000/auth/reset-password/${token}`;
        const mailOptions = {
          to: email,
          from: process.env.EMAIL_USER,
          subject: "Password Reset Request",
          text: `You requested a password reset. Click this link to reset your password: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (mailErr) => {
          if (mailErr) {
            console.error("Email Error:", mailErr);
            return res.status(500).json({ message: "Email sending failed" });
          }
          res.json({ message: "Password reset email sent successfully" });
        });
      }
    );
  });
};
