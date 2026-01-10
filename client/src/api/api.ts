const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2000/api';

const Register = async (name: string, email: string, password: string, role: string) => {
  try{
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, email, password, role }),
  });
  
  const data = await response.json();
  return data;
  }
  catch(err){
    console.log("Frontend Register Function", err)
  }
}

const Login = async (email: string, password: string) => {
  try{
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
  }
  catch(err){
    console.log("Frontend Login Function", err)
  }
};

const Logout = async () => {
  try{
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();
  return data;
  }
  catch(err){
    console.log("Frontend Logout Function", err)
  }
};

const GetProfile = async () => {
  try{
  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();
  return data;
  }
  catch(err){
    console.log("Frontend Get Function", err)
  }
};

const CreateCls = async (clsName: String) => {
  try{
    const name = clsName;
    const res = await fetch(`${API_URL}/createClass`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({name})
    })
    const data = res.json()
    return data;
  }
  catch(err){
    console.error(err)
  }
}

export { Register, Login, GetProfile, CreateCls, Logout };