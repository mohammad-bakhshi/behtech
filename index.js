import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/connectDB.js";
import ProductRouter from "./routes/product.router.js";

config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api", ProductRouter);

// Health check endpoint

app.get("/", (req, res) => {
  res.send({
    status: 200,
    success: true,
    message: "Server Running...",
  });
});

// Handle 404 errors
app.use((req, res, next) => {
  const error = new Error("Requested URL Not Found");
  error.status = 404;
  next(error);
});

// Global error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    status: error.status || 500,
    success: false,
    message: error.message || "Internal Server Error",
  });
});

// Start the server
// Database connection and server start
(async () => {
  try {
    await connectDB(process.env.DB_URI, process.env.DB_NAME);
    app.listen(port, () => console.log("APP RUNNING ON PORT:", port));
  } catch (error) {
    console.error("Failed to Start the Server: ", error);
    process.exit(1);
  }
})();
