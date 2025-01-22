import express from "express";
import "dotenv/config";
import cors from "cors";
import auth from "./routes/auth.route.js";
import onboard from "./routes/onboarding.route.js";
import home from "./routes/home.route.js";
import blog from "./routes/socials.route.js";
import { verifyJWT } from "./middleware/auth.middleware.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { mongooDBConnect } from "./db/mongoose.db.js";

const app = express();
const PORT = process.env.PORT;

// corsOptions
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'; // Set a default URL for local development
const corsOptions = {
    origin: CLIENT_URL, // Same as before
    credentials: true,   // Same as before
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Add allowed methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Add allowed headers
};


app.use(cors(corsOptions)); // Use the updated CORS configuration

// middleware
app.use(cookieParser());

// Increase the size limit for JSON bodies
app.use(express.json({ limit: "10mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true })); // For form submissions
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// routes
app.use("/api/auth", auth);

// Onboarding routes with JWT verification
app.use("/api/onboard", verifyJWT, onboard);

// Home routes with JWT verification
app.use("/api/home", verifyJWT, home);

// Blog routes with JWT verification
app.use("/api/socials", blog);

// connect to MongoDB and start the server
app.listen(PORT, () => {
    mongooDBConnect();
    console.log(`Server is running on localhost:${PORT}`);
});
