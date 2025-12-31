import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/Home');
  };

  return (
    <>
    <div>SignIn</div>
    <form 
    onSubmit={handleSubmit}
    >
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button type="submit">Sign In</button>
    </form>
    </>
  );
};

export default SignIn;