import jwt from "jsonwebtoken";

export const generateSocialsToken = (res, userId) => {
  const socialsToken = jwt.sign({ userId }, process.env.SECRET);

  res.cookie("socialsToken", socialsToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return socialsToken;
};
