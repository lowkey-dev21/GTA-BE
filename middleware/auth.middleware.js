import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../model/auth/user.model.js";

export const verifyJWT = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.cookies.token
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
    console.log("Erro in verifyToken", error);
    return res.status(401).json({ success: false, message: "Server Error" });
  }
};
