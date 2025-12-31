import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/Home');
  };

  return (
    <>
    <div>SignUp</div>
    <form 
    onSubmit={handleSubmit}
    >
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
    </>
  );
};

export default SignUp;