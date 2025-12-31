import mongoose, { Schema, Types } from 'mongoose';
const {ObjectId} = Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["teacher", "student"],
        required: true
    }
})
const User =  mongoose.model("User", userSchema);

const classSchema = new mongoose.Schema({
    teacherId: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    studentIds: [
        {
        type: ObjectId,
        ref: "User",
    },
    ]
})
const Class = mongoose.model("Class", classSchema);

const attendanceSchema = new mongoose.Schema({
    classId: {
        type: ObjectId,
        ref: "Class",
        required: true,
    },
    studentId: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    status:{
        type: String,
        enum: ["present", "absent"],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})
const Attendance = mongoose.model("Attendance", attendanceSchema)

export { User, Class, Attendance }
