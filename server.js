import express from "express";
import "dotenv/config";
import cors from "cors";
import auth from "./routes/authApi.js";
import onboard from "./routes/onboarding.js"
import home from "./routes/homeApi.js";
import blog from "./routes/blogApi.js";
import { verifyJWT } from "./middleware/verifyJWT.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { mongooDBConnect } from "./db/mongoose.db.js";

const app = express();
const PORT = process.env.PORT;

// corsOptions
const CLIENT_URL = process.env.CLIENT_URL
app.use(
  cors({ origin: CLIENT_URL, credentials: true }),
);

// middleware
app.use(cookieParser());

// Increase the size limit for JSON bodies
app.use(express.json({ limit: "10mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true })); // For form submissions
app.use(cookieParser());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/auth", auth);

//Onboarding routes with JWT verification
app.use("/api/onboard", verifyJWT, onboard)

// Home routes with JWT verification
app.use("/api/home", verifyJWT, home);

// Blog routes with JWT verification
app.use("/api/blog", verifyJWT, blog);

// connect to MongoDB and start the server
app.listen(
  PORT,
  () => (
    mongooDBConnect(), console.log(`Server is running  on localhost:${PORT}`)
  ),
);
