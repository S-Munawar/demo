import { Response } from "express";
import { User } from "../models/models";
import { AuthRequest } from "../middleware/auth";

const profile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                "success": false,
                "error": "User not found",
            });
        }
        return res.status(200).json({
            "success": true,
            "data": user,
        });
    } catch (err) {
        return res.status(500).json({
            "success": false,
            "error": "Internal server error",
        });
    }

};

export { profile };