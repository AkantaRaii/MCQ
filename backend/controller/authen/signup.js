const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models/db");

exports.signup = async (req, res) => {
    console.log('Signup request received:', req.body);
    const { username, email, password, isAdmin, adminSecret } = req.body;

    if (!username || !email || !password) {
        console.log('Missing required fields');
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if the user is registering as an admin
    let isAdminFlag = false;
    if (isAdmin) {
        console.log('Admin registration attempted');
        console.log('Received admin secret:', adminSecret);
        console.log('Expected admin secret:', process.env.ADMIN_SECRET);
        // If admin secret is provided and matches, allow admin registration
        if (adminSecret === process.env.ADMIN_SECRET) {
            console.log('Admin secret matched!');
            isAdminFlag = true;
        } else {
            console.log('Admin secret mismatch!');
            return res.status(403).json({ message: "Invalid Admin Secret!" });
        }
    }

    // Check if the user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
            console.log('User already exists:', email);
            return res.status(409).json({ message: "User already exists!" });
        }

        // If the request is not from Google, hash the password
        let hashedPassword = null;
        if (!req.body.googleSignup) {  // If it's not Google sign-up, hash the password
            try {
                const saltRounds = 10;
                hashedPassword = await bcrypt.hash(password, saltRounds);
                console.log('Password hashed successfully');
            } catch (hashError) {
                console.error('Password hashing error:', hashError);
                return res.status(500).json({ message: "Error processing password" });
            }
        }

        // Insert new user into the database
        const newUser = { 
            username, 
            email, 
            password_hash: hashedPassword || null, // Use null if it's Google sign-up
            is_admin: isAdminFlag || false 
        };

        console.log('Attempting to insert new user:', { ...newUser, password_hash: '[HIDDEN]' });

        db.query("INSERT INTO users SET ?", newUser, (err, result) => {
            if (err) {
                console.error('User insertion error:', err);
                return res.status(500).json({ message: "Error creating user" });
            }

            console.log('User created successfully with ID:', result.insertId);

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
