import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../model/auth/user.model.js";

export const verifyJWT = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.header("Authorization");
  const token = req.cookies.token || authHeader && authHeader.split(" ")[1]; // Extract token if header is present

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token missing" });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }
    const user = await User.findById(decoded.userId);

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in verifyToken", error);
    return res.status(401).json({ success: false, message: "Server Error" });
  }
};
