module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "First log in",
        redirect: "/auth/signin", // Provide the sign-in route for frontend handling
      });
    }
    next();
  };
  
  