import jwt from "jsonwebtoken";
import SocialsUser from "../model/socials/user.model.js"

export const verifySocialsUser = async (req, res, next) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Find by userId only
    const socialsToken = req.cookies.socialsToken
    const socialUser = await SocialsUser.findOne({ userId: socialsToken.userId});
    
    if (!socialUser) {
      return res.status(403).json({ 
        message: "Please create a social profile first",
        redirect: "/socials/create-profile"
      });
    }

    req.socialUser = socialUser;
    next();

  } catch (error) {
    console.error("Social verification error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};