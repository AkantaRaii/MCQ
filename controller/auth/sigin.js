const db=require('../../models/db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

exports.signin=async (req,res)=> {
    const { username, password } = req.body;
    const [[user]] = await db.promise().query(`SELECT * FROM Users WHERE username=?`, [username]);

    if(user && user.is_admin) {
        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (result) {
                const token = jwt.sign({ user: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' }); 
                res.cookie('user_session', token, { httpOnly: true, secure: true,maxAge:24*60*60*1000});
                
                // Redirect only after setting the cookie
                return res.redirect('/admin/courses');
            } else {
                return res.status(401).json({ 'message': 'Invalid credentials' });
            }
        });
    } else {
        return res.status(401).json({ 'message': 'Unauthorized access' });
    }
}