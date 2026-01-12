import { Response } from "express";
import { User, Class, Attendance } from "../models/models"
import type { UserType, ClassType } from "../types/zod";
import { AuthRequest } from "../middleware/auth";

export interface ActiveSession {
    classId: string;
    teacherId: string;
    startedAt: string; // ISO String
    attendance: Record<string, "present" | "absent">;
}

let activeSessions: ActiveSession | null = null;

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

        const clsExists = await Class.findOne({className: clsName})

        if (clsExists){
            return res.status(400).json({
                "success": false,
                "error": "Class already exists",
            });
        }

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
        return res.json({
            "success": false,
            "message": "Can't create class"
        })
    }
    }

const Classes = async (req: AuthRequest, res: Response) => {
    try {
        const {id, role} = req.user!;

        let classes: ClassType[] = [];
        if (role === 'teacher'){
            classes = await Class.find({teacherId: id})
        }
        else {
            classes = await Class.find({studentIds: id})
        }

        if (classes.length === 0){
            return res.status(404).json({
            "success": false,
            "message": "No Classes"
        }) 
        }
        res.status(200).json({
            "success": true,
            "data": classes
        })
    }
    catch(err){
        return res.json({
            "success": false,
            "message": "Can't get classes"
        })
    }
}

const Students = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.user!;
        const classId = req.params.id;

        const cls: ClassType | null = await Class.findById({_id: classId})
        const classStudents = cls?.studentIds;
        const Students = await User.find({role: "student", _id: {$nin: classStudents}}).select("-password");

        if (!Students){
            return res.json({
            "success": false,
            "message": "No Students"
        })
        }

        res.status(200).json({
            "success": true,
            "data": Students
        })
    }
    catch(err){
        return res.status(500).json({
            "success": false,
            "message": "Can't get classes"
        })
    }
}

const AddStudents = async (req: AuthRequest, res: Response) => {
    try{
        const classId = req.params.id;
        const {studentId} = req.body

        if (!studentId || !classId){
            return res.status(400).json({
            "success": false,
            "message": "Invalid request"
        })
        }
        const cls: ClassType | null = await Class.findById({_id: classId})
        if (cls?.studentIds.includes(studentId)){
            return res.status(400).json({
            "success": false,
            "message": "Student already in class"
        })
        }
        const data = await Class.findByIdAndUpdate(classId, {
            $push: {studentIds: studentId}
        }, {new: true}) // new: true to return updated document to data

        return res.status(200).json({
            "success": true,
            "data": data
        })
    }
    catch(err){
        return res.status(500).json({
            "success": false,
            "message": "Can't get classes"
        })
    }
}

const GetClass = async (req: AuthRequest, res: Response) => {
    const classId = req.params.id;
    try{
        const data: ClassType | null = await Class.findById({_id: classId})

        if (!data){
            return res.status(400).json({
            "success": false,
            "message": "Class not found"
        })
        }

        return res.status(200).json({
            "success": true,
            "data": data
        })
    }
    catch(err){
        return res.status(500).json({
            "success": false,
            "message": "Can't get class"
        })
    }
}

const GetAttendance = async (req: AuthRequest, res: Response) => {
    try{
        const classId = req.params.id;
        console.log('GetAttendance endpoint')
        const {id: studentId} = req.user!;
        if (!classId || !studentId){
            return res.status(400).json({
            "success": false,
            "message": "Invalid request"
        })
        }
        let attendanceRecord = await Attendance.findOne({classId, studentId});

        if (!attendanceRecord){
            attendanceRecord = await Attendance.create({
                classId,
                studentId,
        })
        }

        return res.status(200).json({
            "success": true,
            "data": attendanceRecord
        })
    }
    catch(err){
        return res.status(500).json({
            "success": false,
            "message": "Can't get attendance"
        })
    }
}

const StartAttendanceSession = async (req: AuthRequest, res: Response) => {
    try{
        const {classId} = req.body;
        console.log('StartAttendanceSession endpoint')
        const {id: teacherId} = req.user!;
        if (!classId || !teacherId){
            return res.status(400).json({
            "success": false,
            "message": "Invalid request"
        })
        }

        const cls: ClassType | null = await Class.findById({_id: classId})
        if (!cls){
            return res.status(404).json({
            "success": false,
            "message": "Class not found"
        })
        }

        if (cls.teacherId.toString() !== teacherId){
            return res.status(403).json({
            "success": false,
            "message": "Not authorized to start attendance for this class"
        })
        }

        const session = await startSession(classId, teacherId);
        console.log("Active Session:", session)

        return res.status(200).json({
            "success": true,
            "message": "Attendance session started"
        })
    }
    catch(err){
        return res.status(500).json({
            "success": false,
            "message": "Can't Start session"
        })
    }
}

const startSession = async (classId: string, teacherId: string) => {
    try {
        if (activeSessions) {
            throw new Error("Session already in progress");
        }
        const session: ActiveSession = {
            classId,
            teacherId,
            startedAt: new Date().toISOString(),
            attendance: {}
        };
        activeSessions = session;
        return session;
        } catch (err) {
            console.error("Failed to start session"); 
        }
}

const endSession = async () => {
    try {
        if (!activeSessions) {
        throw new Error("No Session");
        }
        const session = activeSessions;
        activeSessions = null;
        return session;
        } catch (err) {
            console.error("Failed to end session"); 
        }
}

const MarkAttendance = async (classId: string, studentId: string, status: "present" | "absent") => {
    try {
        if (!activeSessions) {
            throw new Error("No active session");
        }
        activeSessions.attendance[studentId] = status;
        const attendance = await Attendance.findOneAndUpdate(
            { classId, studentId }, // filter
            { $set: { status, date: new Date() } }, // update
            { upsert: true, new: true } // options: create if not exists, return updated document
        );
        console.log("Attendance marked:", attendance);
        return { classId, studentId, status, date: attendance?.date };
    } catch (err) {
        console.error("Failed to mark attendance");
        return null;
    }
}

const GetAttendanceData = () => {
    try {
        const presentStudents = Object.entries(activeSessions?.attendance || {})
            .filter(([_, status]) => status === "present")
            .map(([studentId, _]) => studentId)
            .length;

        const totalStudents = Object.keys(activeSessions?.attendance || {}).length;
        const absent = totalStudents - presentStudents;
        
        const data = {
            "present": presentStudents,
            "absent": absent,
            "total": totalStudents,
        };
        return data;
    }
    catch (err) {
        console.error("Failed to get attendance data");
    }
}

const ClassStudents = async (classId: string) => {
    try {

        const cls: ClassType | null = await Class.findById({_id: classId})
        const classStudents = cls?.studentIds;
        const Students = await User.find({role: "student", _id: {$in: classStudents}})
        return Students
    }
    catch(err){
        throw new Error("Can't get class students")
    }
} 

export { ClassStudents, activeSessions, endSession, startSession, profile, CreateClass, Classes, Students, AddStudents, GetClass, GetAttendance, StartAttendanceSession, MarkAttendance, GetAttendanceData };