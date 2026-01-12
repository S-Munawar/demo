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
        required: true,
        minLength: 6,
    },
    role: {
        type: String,
        enum: ["teacher", "student"],
        required: true
    }
})

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
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
        default: "absent",
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

const User =  mongoose.model("User", userSchema);
const Class = mongoose.model("Class", classSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema)

export { User, Class, Attendance }
