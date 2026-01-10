import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GetProfile } from '../api/api'
import {Navigate} from 'react-router-dom';

const Landing = () => {
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await GetProfile();
        if (response?.success) {
          <Navigate to='/Home' />
          throw new Error(response?.error || 'Error fetching user details');
        }
        setUser(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [])

  return (
  <div>
    <h1>Welcome to the Landing Page</h1>
    <Link to="/signin">Sign In</Link>
    <Link to="/signup">Sign Up</Link>
  </div>
  )
  
  
};

export default Landing;