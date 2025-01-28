import express from "express";
import "dotenv/config";
import cors from "cors";
import auth from "./src/routes/auth.route.js";
import onboard from "./src/routes/onboarding.route.js";
import home from "./src/routes/home.route.js";
import socials from "./src/routes/socials.route.js";
import { verifyJWT } from "./src/middleware/auth.middleware.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { mongooDBConnect } from "./src/db/mongoose.db.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors("*"));

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

app.use(verifyJWT)

// Onboarding routes with JWT verification
app.use("/api/onboard", onboard);

// Home routes with JWT verification
app.use("/api/home", home);

// Blog routes with JWT verification
app.use("/api/socials", socials);

// connect to MongoDB and start the server
app.listen(PORT, () => {
    mongooDBConnect();
    console.log(`Server is running on localhost:${PORT}`);
});
