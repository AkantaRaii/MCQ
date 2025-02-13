const bcrypt = require("bcryptjs");
const db = require("../../models/db");

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  db.query(
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
    [token, new Date().getTime()], // Ensure correct timestamp format
    (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      if (results.length === 0)
        return res.status(400).json({ message: "Invalid or expired token" });

      const hashedPassword = bcrypt.hashSync(password, 10);
      db.query(
        "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?",
        [hashedPassword, token],
        (updateErr) => {
          if (updateErr) {
            console.error("Update Error:", updateErr);
            return res.status(500).json({ message: "Database error" });
          }
          res.json({ message: "Password reset successful, you can now log in" });
        }
      );
    }
  );
};
