import { CheckAttendance } from "../api/api"
import { useLocation } from "react-router-dom"

const AttendClass = () => {

    const {state} = useLocation();
    const { cls } = state;

    const handleCheckAttendance = async () => {
        try{
            const response = await CheckAttendance(cls._id)
            if (!response.success){
                throw new Error("Error checking attendance")
            }
            console.log("Fetched Attendance Record")
            console.log(response.data)
        }
        catch(err){
            console.error(err)
        }
    }

    return(
        <>
        <p>Class: {cls._id}</p>
        <p>Teacher: {cls.teacherId}</p>
        <button onClick={() => handleCheckAttendance()}>Check Attendance</button>
        </>
    )
}
    
export default AttendClass