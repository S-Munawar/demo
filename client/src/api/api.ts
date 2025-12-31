import dotenv from 'dotenv';
dotenv.config();
import 

const API_URL = process.env.API_URL || 'http://localhost:5000';

const Register = (email: string, password: string, role: ) => {

}

const Login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
};

export { Login };