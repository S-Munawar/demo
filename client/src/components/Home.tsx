import { useEffect, useState } from 'react';
import { GetProfile, Logout } from '../api/api'
import {useNavigate} from 'react-router-dom';
import StudentDash from './StudentDash';
import TeacherDash from './TeacherDash';

const Home = () => {

  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
      const response = await Logout()
      if (!response.success){
        throw new Error("Frontend: LogoutError")
      }
      navigate('/SignIn');
    }
    catch(e){
      console.error(e)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await GetProfile();
        if (!response?.success) {
          navigate('/SignIn');
          throw new Error(response?.error || 'Error fetching user details');
        }
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [])
  
  return (
  <div>
    <button onClick={() => handleLogout()}>Logout</button>
    <h1>Welcome to the Home Page</h1>
    {user ? (
      user.role === 'teacher' ? (
        <TeacherDash user={user} />
      ) : (
        <StudentDash user={user} />
      )
    ) : (
      <p>Loading user details...</p>
    )}
  </div>
  )
  
  
};

export default Home;