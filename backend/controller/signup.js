const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length > 0) {
            return res.status(409).json({ message: "User already exists!" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user into database
        const newUser = { username, email, password_hash: hashedPassword };
        db.query("INSERT INTO users SET ?", newUser, (err, result) => {
            if (err) return res.status(500).json({ message: "Error creating user" });

            // Generate JWT Token
            const token = jwt.sign(
                { userId: result.insertId, email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(201).json({
                message: "Signup successful!",
                user: { id: result.insertId, email, name: username },
                token
            });
        });
    });
};
