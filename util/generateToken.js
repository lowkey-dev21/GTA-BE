import jwt from "jsonwebtoken";
import path from "path";
import "dotenv/config"
export const generateTokenAndCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    domain: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'localhost'
  });
  return token;
};
