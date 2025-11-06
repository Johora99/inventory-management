const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const { createServer } = require("node:http");


dotenv.config();
connectDB();

const PORT = process.env.PORT || 5001;
const server = createServer(app);

if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
