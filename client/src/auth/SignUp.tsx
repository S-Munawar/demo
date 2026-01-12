import React from 'react';
import { Link } from 'react-router-dom';
import { Register, setToken } from '../api/api';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('student');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doSignUp = async () => {
      try {
        console.log('SignUp called');
        const res = await Register(name, email, password, role);
        if (!res?.success) {
          throw new Error(res?.error || 'SignUp Error');
        }
        if (res.token) {
          setToken(res.token);
        }
        navigate('/SignIn');
      } catch (err) {
        console.error('Error during registration:', err);
      }
    };
    doSignUp();
  };

  return (
    <>
    <div>SignUp</div>
    <form 
    onSubmit={(e) => handleSubmit(e)}
    >
      <input onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" />
      <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <select onChange={(e) => setRole(e.target.value)} defaultValue="student">
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
    <Link to="/signin">Sign In</Link>
    </>
  );
};

export default SignUp;