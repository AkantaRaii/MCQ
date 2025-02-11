const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models/db");

exports.signup = async (req, res) => {
    const { username, email, password, isAdmin, adminSecret } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if the user is registering as an admin
    let isAdminFlag = false;
    if (isAdmin) {
        // If admin secret is provided and matches, allow admin registration
        if (adminSecret === process.env.ADMIN_SECRET) {
            isAdminFlag = true;
        } else {
            return res.status(403).json({ message: "Invalid Admin Secret!" });
        }
    }

    // Check if the user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length > 0) {
            return res.status(409).json({ message: "User already exists!" });
        }

        // If the request is not from Google, hash the password
        let hashedPassword = null;
        if (!req.body.googleSignup) {  // If it's not Google sign-up, hash the password
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        // Insert new user into the database
        const newUser = { 
            username, 
            email, 
            password_hash: hashedPassword || null, // Use null if it's Google sign-up
            is_admin: isAdminFlag || false 
        };

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
