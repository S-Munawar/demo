import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'
import Landing from './components/Landing'
import StudentDash from './components/StudentDash'
import TeacherDash from './components/TeacherDash'

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
    </Routes>        
    </BrowserRouter>
  )
}

export default App
