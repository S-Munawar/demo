import jwt from "jsonwebtoken";
import type { UserType } from "../types/zod"
import { Types } from "mongoose";
import dotenv from 'dotenv';

interface jwt {
    userId: Types.ObjectId,
    role: "student" | "teacher"
}

const CreateToken = ({userId, role}: jwt) => {
    const token = jwt.sign(
        {
            userId: userId,
            role: role
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "1h"
        }
    );
    return token;
}

const verifyToken = async (token: string) => {
    try{
    const verified = await jwt.verify(token, process.env.JWT_SECRET!)
    return verified;
    }
    catch(err){
        console.log(err)
    }
}

export { CreateToken, verifyToken }