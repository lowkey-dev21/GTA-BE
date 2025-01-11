import SocialsUser from  "../../model/socials/user.model.js"
import User from "../../model/auth/user.model.js"

export const createSocialsUser = async (req, res) => {
    const {bio, profilePicture , name} = req.body;
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const existedUser = await SocialsUser.findOne({username: user.username})

        if(existedUser){
            return res.status(400).json({message: "Username already existed"})
        }

        if (!user) {
            return res.status(400).json({ message: "User not found in Education " });
        }

        console.log(user.username)
        const socialUser = await SocialsUser.create({
            username: user.username,
            name: name,
            profilePicture: profilePicture,
            bio: bio,
        })

       return res.status(201).json({socialsUser: {...socialUser._doc}});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}