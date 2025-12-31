import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/models";
import { CreateToken } from "../utils/jwt";


const isRequired = (req: Request, res: Response, next: NextFunction) => {
    const {email, password, role} = req.body;

    if (!email || !password || !role){
        return res.status(400).json({
            "success": false,
            "message": "Invalid Credentials"
        })
    }
}

export {isRequired};