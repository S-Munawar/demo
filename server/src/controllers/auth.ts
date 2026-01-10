import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/models";
import { CreateToken } from "../utils/jwt";


const Register = async (req: Request, res: Response) => {

    const {name, email, password, role} = req.body;
    console.log('Register endpoint')

    if (!name || !email || !password || !role){
        return res.status(400).json({
            "success": false,
            "message": "Invalid Credentials"
        })
    }

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
            name,
            email,
            password: hashedPassword,
            role
        })
        console.log("user", user)
        

        const jwtToken = CreateToken({
        userId: user._id,
        role: user.role,
    }) 

    res.cookie('token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
        "success": true,
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
    const method = req.method;
    const path  = req.path;
    console.log(path);
    console.log(method);
    console.log('Login endpoint')

    if (!email || !password){
        return res.status(400).json({
            "success": false,
            "message": "Invalid Credentials"
        })
    }

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

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).send('OK').json({
        "success": true,
    })

}

export {Register, Login};