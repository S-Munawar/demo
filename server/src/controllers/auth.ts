import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/models";
import { CreateToken } from "../utils/jwt";


const Register = async (req: Request, res: Response) => {

    const { email, password, role } = req.body;

    const userExist = await User.findOne({email});

    if (userExist){
        return res.status(409).json({
            "success": false,
            "error": "User already exist",
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    try{
        const user = await User.create({
            email,
            password: hashedPassword,
            role
        })

        const token = CreateToken({
        userId: user._id,
        role: user.role,
    }) 

    return res.status(201).json({
        "success": true,
        "token": token,
    })
    }
    catch (err){
        return res.status(500).json({
            "success": false,
            "error": "Internal server error",
        })
    }
}

const Login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await User.findOne({email});

    if (!user){
        return  res.status(404).json({
            "success": false,
            "error": "User not found",
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid){
        return res.status(401).json({
            "success": false,
            "message": "Invalid credentials"
        })
    }

    const token = CreateToken ({
        userId: user._id,
        role: user.role,
    })

    return res.status(200).json({
        "success": true,
        token
    })

}

export {Register, Login};