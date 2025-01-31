const checkApiKey = (req, res, next) => {
    const apiKey = req.query.api_key || req.headers["api-key"];
    if (apiKey === process.env.API_KEY) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized: Invalid API Key" });
    }
  };
  
  module.exports = checkApiKey;
  