import { useState, useEffect } from "react"
import { GetClasses } from "../api/api";
import AttendClass from "./AttendClass";
import { useNavigate } from "react-router-dom";

const StudentDash = ({ user }: any) => {

  const [classes, setClasses] = useState<Array<any>>([])
  const navigate = useNavigate();

  useEffect(() => {
    
    try{
      const Classes = async () => {
      const response = await GetClasses();
      if (!response.success){
        throw new Error("Frontend: Error Creating class")
      }
      setClasses(response.data)
    }
    Classes();
  }
    catch(err){
      console.error(err)
    }
  }, [])

  


  return (
    <div className="flex items-center justify-center">
      <div>
      <h1>Student Dashboard: {user.name}</h1>
      <div>
      </div>
        {classes.map((cls: any) => (
          <div key={cls._id}>
            <p>Class: {cls.className}</p>
            <button onClick={() => navigate("/AttendClass", {state: {cls}})} >Attend Class</button>
          </div>
        ))}
      </div>
    </div>
  )
  
};

export default StudentDash;