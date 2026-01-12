import { useState, useEffect } from "react"
import { AddStudent, GetAllStudents, MarkAttendance, StartAttendanceSession, connectWebSocket } from "../api/api"
import { useLocation } from "react-router-dom"

const TakeClass = () => {

    const [studnets, setStudents] = useState([])
    const {state} = useLocation();
    const { cls } = state;

    useEffect(() => {
        // Connect WebSocket when component mounts
        connectWebSocket();
        
        try{
            const AllStudents = async () => {
                const response = await GetAllStudents(cls._id)
                if (!response.success){
                    throw new Error("Error adding student")
                }
                console.log("Fetched Students")
                setStudents(response.data)
            }
            AllStudents()
        }
        catch(err){
            console.error(err)
        }
    }, [])

    const handleAddStudent = async (studentId: string) => {
        try{
            const response = await AddStudent(studentId, cls._id)
            if (!response.success){
                throw new Error("Error adding student")
            }
            console.log("Added student")
        }
        catch(err){
            console.error(err)
        }
    }

    return(
        <div className="flex items-center justify-center">
            <div>
            <p>{cls.className}</p>
            <p>Class: {cls._id}</p>
            <p>Teacher: {cls.teacherId}</p>
            <p>Students:</p>
            <button onClick={() => StartAttendanceSession(cls._id)}>Start Session</button>
            {cls.studentIds.map((studentId: string) => (
                <div key={studentId}>
                    <p>{studentId}</p>
                    <button onClick={() => MarkAttendance(cls._id, studentId, "present")} >Present</button>
                    <button onClick={() => MarkAttendance(cls._id, studentId, "absent")} >Absent</button>
                </div>
            ))}
            </div>
            <div>
                {studnets.map((student: any) => (
                    <div key={student._id}>
                        <p>{student.name} - {student.email}</p>
                        <button onClick={() => handleAddStudent(student._id)}>Add Student</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TakeClass