// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const db = require("../database/db");

// exports.signin = (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: "Email and Password are required!" });
//     }

//     // Check if user exists in the database
//     db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
//         if (err) return res.status(500).json({ message: "Database error" });

//         if (results.length === 0) {
//             return res.status(401).json({ message: "Invalid email or password!" });
//         }

//         const user = results[0];

//         // Compare stored hashed password with entered password
//         const isMatch = await bcrypt.compare(password, user.password_hash);
//         if (!isMatch) {
//             return res.status(401).json({ message: "Invalid email or password!" });
//         }

//         // Generate JWT Token
//         const token = jwt.sign(
//             { userId: user.id, email: user.email },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );

//         res.json({
//             message: "Login successful!",
//             user: { id: user.id, email: user.email, name: user.username },
//             token
//         });
//     });
// };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

exports.signin = (req, res) => {
    const { email, password, isAdmin } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const user = results[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // Check if login matches expected role
        if (isAdmin && !user.is_admin) {
            return res.status(403).json({ message: "You are not an admin!" });
        }
        if (!isAdmin && user.is_admin) {
            return res.status(403).json({ message: "Use admin login!" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user.id, email: user.email, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful!",
            user: { id: user.id, email: user.email, name: user.username, is_admin: user.is_admin },
            token
        });
    });
};
