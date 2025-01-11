import jwt from "jsonwebtoken";
import "dotenv/config";

export const emailJWT = (req, res, next) => {
  // Look for token in cookies or Authorization header
  const token = req.cookies?.emailVerifyToken

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, email verification token missing" });
  }

  try {
    // Verify the token using the secret from environment variables
    const decoded = jwt.verify(token, process.env.SECRET);

    if (!decoded || !decoded.verified) {
      return res.status(403).json({ message: "Email not verified." });
    }

    // Attach decoded token to req for further use in next middleware/route
    req.token = decoded;
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error.message);

    // Handle expired or invalid token cases separately for better clarity
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
