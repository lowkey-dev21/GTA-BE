import User from "../../model/user/user.model.js"

export const getProfileInfo =  async (req,res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id)
        if(!user) return res.status(404).json({message: "User not found"})
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: "Unable to get profile", error: erro.message})
    }
}