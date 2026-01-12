import {useEffect, useState} from 'react'
import { CreateCls, GetClasses } from '../api/api';
import { useNavigate } from "react-router-dom";
import TakeClass from './TakeClass';

const TeacherDash = ({ user }: any) => {

  const [clsName, setClsName] = useState('')
  const [classes, setClasses] = useState([])
  const navigate = useNavigate();

 
  const CreateClass = async () => {
    try{
      const response = await CreateCls(clsName);
      if (!response.success){
        throw new Error("Frontend: Error Creating class")
      }
    }
    catch(err){
      console.error(err)
    }
  }

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
    <div className='flex item-center justify-center' >
      <h1>Teacher Dashboard: {user.name}</h1>
      <form 
      onSubmit={() => CreateClass()}
      >
        <input type="text" onChange={(e) => setClsName(e.target.value) } placeholder='Class Name'></input>
        <button type="submit">Create Class</button>
      </form>
      <div>
        {classes.map((cls: any, index: number) => (
          <div key={cls._id}>
            <button onClick={() => navigate("/TakeClasses", {state: {cls}})} >Class {index + 1}</button>
          </div>
        ))}
      </div>
    </div>
  )
  
};

export default TeacherDash;