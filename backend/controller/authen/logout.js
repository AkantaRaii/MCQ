exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.redirect("/auth/signin"); // Redirect to Sign In page after logout
      });
    });
  };
  