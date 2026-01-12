import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Login, setToken } from '../api/api';
const SignIn = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doSignIn = async () => {
      try {
        console.log('SignIn called');
        const res = await Login(email, password);
        if (!res?.success) {
          throw new Error(res?.error || 'SignIn Error');
        }
        if (res.token) {
          setToken(res.token);
        }
        navigate('/Home');
      } catch (err) {
        console.error('Error during login:', err);
      }
    };
    doSignIn();
  };

  return (
    <>
    <div>SignIn</div>
    <form 
    onSubmit={(e) => handleSubmit(e)}
    >
      <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Sign In</button>
    </form>
    <Link to="/signup">Sign Up</Link>
    </>
  );
};

export default SignIn;