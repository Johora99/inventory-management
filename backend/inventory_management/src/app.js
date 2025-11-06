const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
app.use(express.json());
const authRoutes = require("./routes/authRouter");
const errorHandler = require("./middlewares/errorMiddleware");
const inventoryRoute = require("./routes/inventoryRoute")

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running successfully!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Your existing routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoute);




// Error Handler
app.use(errorHandler);

module.exports = app;
