import jwt from "jsonwebtoken";
import type { UserType } from "../types/zod"
import { Types } from "mongoose";

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

export {CreateToken};