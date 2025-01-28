import Follow from "../../model/socials/follow.model.js"
import User from "../../model/user/user.model.js"

//follow a user 
export const follow = async(req,res) =>{
    try {
        const {followingId } = req.body
        const userToFollow = await User.findById(followingId)
        if(!userToFollow) return res.status(404).json({ message: "User not found" })

      await Follow.findAndUpdate({
        follower: req.user._id,
        following: userToFollow._id
      },
      {}
      ,{
        upsert: true,
        new: true,
        runValidator: true
      })

        res.status(201).json({message: "followed successfully"})
    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({message: "Already following this user"})
        }
        res.status(500).json({message: "Error following user ", error: error.message})
    }
}


//unfollow a user 
export const unfollow = async (req,res) => {
    try {
        const {followingId} = req.body
        const userToUnfollow = await User.findById(followingId)
        if(!userToUnfollow) return res.status(404).json({message: 'User not found'})
        
        await Follow.deletOne({
            follower: req.user._id,
            following: userToUnfollow._id
        })
        res.status(201).json({message: "Successfully Unfollowed User"})
    } catch (error) {
        res.status(500).json({message: "Failed to Unfollow user", error: error.message})
    }
}

//get followers with paginatioin 
export const getFollowers = async(req,res)=> {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const followers = await Follow.find({ following: req.user._id })
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate({path: "follower" , select: "username firstName lastName"})

        const totalFollowers = await Follow.countDocuments({ following: req.user._id })
        res.status(200).json({
            followers: followers.map(f => f.follower),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFollowers / limit),
                totalFollowers,
                hasMore: totalFollowers > skip + followers.length
            }
        })
    }catch (error){
        res.status(500).json({ message: "Internal Error", error: error.message })
    }

}

// Getting all following
export const getFollowing = async(req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const following = await Relationship.find({ follower: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('following', 'username email');

        // Get total count for pagination
        const totalFollowing = await Follow.countDocuments({ follower: req.user.id });

        res.json({
            following: following.map(f => f.following),
            pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalFollowing / limit),
            totalFollowing,
            hasMore: totalFollowing > skip + following.length
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Error", error: error.message })
    }
}

// Get following status for multiple users (useful for UI)
export const getFollowingStatus = async ( req , res ) => {
    try {
        const { userIds } = req.body; // Array of user IDs to check
    
        const relationships = await Follow.find({
          follower: req.user.id,
          following: { $in: userIds }
        });
    
        const followingMap = {};
        relationships.forEach(rel => {
          followingMap[rel.following.toString()] = true;
        });
    
        res.json(followingMap);
    } catch (error) {
        res.status(500).json({ message: "Internal Error", error: error.message }) 
    }
}

// get Follow suggestion
export const getFollowSuggestion = async ( req, res ) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
    
    // Get IDs of users already following
    const following = await Follow.find({ follower: req.user.id })
      .select('following');
    const followingIds = following.map(f => f.following);
    
    // Find users not in following list
    const suggestions = await User.find({
      _id: { 
        $nin: [...followingIds, req.user.id] 
      }
    })
    .limit(limit)
    .select('username email');

    res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: "Internal Error", error: error.message }) 
    }
}