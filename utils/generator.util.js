import jwt from "jsonwebtoken";
import "dotenv/config";

const generator = {

  generateAuthToken : (res, userId) => {
    const token = jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: "7d",
    });
  
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    return token;
  }
  ,
   generateEmailToken : function(res, userId){
    // After email OTP verification
    const emailVerifyToken = jwt.sign(
      { userId, verified: true }, // Use userId directly
      process.env.SECRET,
      { expiresIn: "3min" } // Token expires in 3 minutes
    )
      // Set the email verification token in a cookie
  res.cookie("emailVerifyToken", emailVerifyToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure secure in production
    sameSite: "strict", // Protect against CSRF
    maxAge: 3 * 60 * 1000,
  });

  return emailVerifyToken; // Returning the token
}

}

export default generator

