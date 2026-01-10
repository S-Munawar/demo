import {useState} from 'react'
import { CreateCls } from '../api/api';

const TeacherDash = ({ user }: any) => {

  const [clsName, setClsName] = useState('')

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
  return (
    <div>
      <h1>Teacher Dashboard: {user.name}</h1>
      <form 
      onSubmit={() => CreateClass()}
      >
        <input type="text" onChange={(e) => setClsName(e.target.value) }></input>
        <button type="submit">Create Class</button>
      </form>
    </div>
  )
  
};

export default TeacherDash;