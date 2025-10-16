import userModel from "../models/userModel.js";
export const getUserData = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.json({ success: false, message: 'User ID not found in request' })
        }

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
        }

        res.json({
            success: true,
            userData: userData
        })

    } catch (error) {
        console.error('getUserData error:', error)
        res.json({ success: false, message: error.message })
    }
}
