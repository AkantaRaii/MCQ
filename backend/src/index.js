require("dotenv").config();
const express = require("express");
const app = express();

const router = require("../routes/router")

const port = process.env.PORT || 2000;

app.use(express.json());

app.use("/api",router);

app.listen(port, () => {
  console.log(`Quiz API running on port ${port}`);
});