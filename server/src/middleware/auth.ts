import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "@/utils/jwt";
dotenv.config();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

const isRequired = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    console.log('Auth Middleware endpoint')

    if (!token){
        return res.status(401).json({
            "success": false,
            "error": "Invalid token",
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        req.user = {
            id: decoded.userId,
            role: decoded.role
        }

        next();
    }
    catch (err){
        return res.status(401).json({
            "success": false,
            "error": "Invalid token",
        })
    }
    
}

const TeacherOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    const {role} = req.user!;
    console.log('TeacherOnly Middleware endpoint')
    if (role !== 'teacher'){
        return res.status(401).json({
            "success": false,
            "message": "Only Teachers"  
        })
    }
    next()
}

const StudentOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    const {role} = req.user!;
    console.log('StudentOnly Middleware endpoint')
    if (role !== 'student'){
        return res.status(401).json({
            "success": false,
            "message": "Only Students"  
        })
    }
    next()
}

export {isRequired, TeacherOnly, StudentOnly};