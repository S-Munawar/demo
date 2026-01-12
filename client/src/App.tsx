import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './components/Home'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'
import Landing from './components/Landing'
import StudentDash from './components/StudentDash'
import TeacherDash from './components/TeacherDash'
import TakeClass from './components/TakeClass'
import AttendClass from './components/AttendClass'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<div>404 Not Found</div>} />
      <Route path="/login" element={<StudentDash />} />
      <Route path="/register" element={<TeacherDash />} />
      <Route path="/TakeClasses" element={<TakeClass />} />
      <Route path="/AttendClass" element={<AttendClass />} />
    </Routes>        
    </BrowserRouter>
  )
}

export default App
