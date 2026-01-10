import { useEffect, useState } from 'react';
import { GetProfile } from '../api/api'
import {useNavigate} from 'react-router-dom';

const Home = () => {

  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await GetProfile();
        if (!response?.success) {
          navigate('/login');
          throw new Error(response?.error || 'Error fetching user details');
        }
        setUser(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [user])
  
  return (
  <div>
    <h1>Welcome to the Home Page</h1>
    <p>{ user ? `Name: ${user.name}, Email: ${user.email}, Role: ${user.role}` : 'Loading user information...' }</p>
  </div>
  )
  
  
};

export default Home;