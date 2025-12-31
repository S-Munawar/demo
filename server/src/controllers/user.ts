import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/models";
import { CreateToken } from "../utils/jwt";


const teacherController = async (req: Request, res: Response) => {
    try {
        const teachers = await User.find({ role: "teacher" }).select("-password");
        return res.status(200).json({
            "success": true,
            "message": "Teachers fetched successfully",
        });
    } catch (err) {
        return res.status(500).json({
            "success": false,
            "error": "Internal server error",
        });
    }
};

const studentController = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: "student" }).select("-password");
        return res.status(200).json({
            "success": true,
            "message": "Students fetched successfully",
        });
    } catch (err) {
        return res.status(500).json({
            "success": false,
            "error": "Internal server error",
        });
    }
};

export { teacherController, studentController };