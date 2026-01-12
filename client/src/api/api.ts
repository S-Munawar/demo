const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2000/api';

let ws: WebSocket | null = null;

const getToken = () => {
  return localStorage.getItem('wsToken') || '';
};

const setToken = (token: string) => {
  localStorage.setItem('wsToken', token);
};

const connectWebSocket = (): WebSocket | null => {
  if (ws && ws.readyState === WebSocket.OPEN) return ws;
  
  const token = getToken();
  if (!token) {
    console.error('No token found, cannot connect WebSocket');
    return null;
  }
  
  ws = new WebSocket(`ws://localhost:2000/ws?token=${token}`);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = event.data;
      console.log('WS message:', data);
    } catch {
      console.log('WS message:', event.data);
    }
  };
  
  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
  };
  
  ws.onclose = () => {
    console.log('WebSocket closed');
    ws = null;
  };
  
  return ws;
};

const MarkAttendance = async (classId: string, studentId: string, status: "present" | "absent") => {
  console.log("Marking attendance via WS")
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    const socket = connectWebSocket();
    if (!socket) {
      console.error('WebSocket is not connected');
      return;
    }
    // Wait for connection to open
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('WebSocket connection timeout')), 5000);
      socket.addEventListener('open', () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });
      socket.addEventListener('error', () => {
        clearTimeout(timeout);
        reject(new Error('WebSocket connection failed'));
      }, { once: true });
    });
  }
  ws!.send(JSON.stringify({
    type: "MARK_ATTENDANCE",
    data: { classId, studentId, status }
  }));
};

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
    const res = await fetch(`${API_URL}/createClass`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({clsName})
    })
    const data = res.json()
    return data;
  }
  catch(err){
    console.error(err)
  }
}

const GetClasses = async () => {
  try{
    const res = await fetch(`${API_URL}/classes`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
    const data = await res.json()
    return data;
  }
  catch(err){
    console.error(err)
  }
}

const AddStudent = async (studentId: string, classId: string) => {
  try{
    const res = await fetch(`${API_URL}/class/${classId}/add-student`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({studentId})
    })
    const data = await res.json()
    return data;
  }
  catch(err){
    console.error(err)
  }
}

const GetAllStudents = async (classId: string) => {
  try{
    const res = await fetch(`${API_URL}/class/${classId}/allStudents`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
    const data = await res.json()
    return data;
  }
  catch(err){
    console.error(err)
  }
}

const CheckAttendance = async (classId: string) => {
  try{
    const res = await fetch(`${API_URL}/class/${classId}/my-attendance`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
    const data = await res.json()
    return data;
  }
  catch(err){
    console.error(err)
  }
}

const StartAttendanceSession = async (classId: string) => {
  try{
    const res = await fetch(`${API_URL}/attendance/start`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({classId})
    })
    const data = await res.json()
    return data;
  }
  catch(err){
    console.error(err)
  }
}

export { Register, Login, GetProfile, CreateCls, Logout, GetClasses, AddStudent, GetAllStudents, CheckAttendance, MarkAttendance, connectWebSocket, setToken, StartAttendanceSession }