import { Response } from "express";
import { User, Class } from "../models/models"
import type { UserType } from "../types/zod";
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
            "data": user as UserType,
        });
    } catch (err) {
        return res.status(500).json({
            "success": false,
            "error": "Internal server error",
        });
    }

};

const CreateClass = async (req: AuthRequest, res: Response) => {
    try {
        const {clsName} = req.body;
        const {id} = req.user!;
        console.log('CreateClass endpoint')

        const Cls = await Class.create({
            className : clsName,
            teacherId : id
        })

        console.log("Class created", Cls)


        res.status(201).json({
            "success": true,
            "message": "Class Created"
        })
    }
    catch(err){
        console.error("Error creating class", err)
    }
    }


export { profile, CreateClass };