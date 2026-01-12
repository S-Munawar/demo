// server/src/server.ts
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/routes';
import cors from 'cors';
import DB from "./config/db";
import cookieParser from 'cookie-parser';
import { WebSocketServer, WebSocket } from "ws";
import http from 'http';
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { GetAttendance, MarkAttendance, GetAttendanceData, activeSessions, ClassStudents, endSession } from './controllers/user';
import { Attendance } from './models/models';

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app)
const wss = new WebSocketServer({server, path: "/ws"});

app.use(cookieParser());
const PORT = process.env.PORT || 2000;
app.use(express.json());
DB();

interface CustomWebSocket extends WebSocket {
  user?: {
    userId: string;
    role: string;
  };
}

wss.on('connection', (ws: CustomWebSocket, req) => {
    try{
      const url = new URL(req.url!, "http://localhost");
      const token = url.searchParams.get("token");
      if (!token) {
        ws.send(JSON.stringify({ event: 'ERROR', data: { error: 'No token', message: 'Authentication required' } }));
        ws.close();
        return;
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (!decoded) {
        ws.close();
        return;
      }
      console.log('Decoded WS2 Token:', decoded);
      ws.user = {
        userId: decoded.userId,
        role: decoded.role,
      }

      ws.on("message", async (msg: string) => {
        try {
          const parsed = JSON.parse(msg.toString());
          console.log('Received message:', parsed);
          
          switch (parsed.type) {
            case "MARK_ATTENDANCE":
                if (ws.user?.role !== 'teacher'){
                  ws.send(JSON.stringify({
                    event: 'ERROR',
                    data: {
                      error: "Unauthorized",
                      message: "Only teachers can mark attendance"
                    }
                  }))
                  return;
                }
                const {classId, studentId, status} = parsed.data;

                const data = await MarkAttendance(classId, studentId, status);

                console.log(`Marking attendance for student ${studentId} in class ${classId}`);
                wss.clients.forEach((client) => {
                  if (client.readyState === WebSocket.OPEN) {
                    console.log(data);
                    client.send(JSON.stringify({
                      event: 'ATTENDANCE_MARKED',
                      data: data
                    }))
                  }
                })
              break;
            case "TODAY_SUMMARY":
                if (ws.user?.role !== 'teacher'){
                  ws.close();
                return;
                }
                const summaryData = GetAttendanceData()
                wss.clients.forEach((client) => {
                  if (client.readyState === WebSocket.OPEN ) {
                    client.send(JSON.stringify(
                      {
                        "event": "TODAY_SUMMARY",
                        "data": summaryData
                      }
                    ))
                  }
                })
              break;
            case "MY_ATTENDANCE":
                if (ws.user?.role !== 'student'){
                  ws.close();
                return;
                }
                let stat = activeSessions?.attendance[ws.user.userId] || "not yet updated";
                ws.send(JSON.stringify({
                  event: 'MY_ATTENDANCE',
                  data: {
                          "status": stat
                        }
                }))
              break;
            case "DONE":
              if (ws.user?.role !== 'teacher'){
                ws.close();
              return;
              }
              if (!activeSessions){
                ws.send(JSON.stringify({
                  event: 'ERROR',
                  data: {
                    error: "No Session",
                    message: "No active session to end"
                  }
                }))
                return;
              }
              const total = await ClassStudents(parsed.data.classId)
              total.map(async (student) => {
                const studentIdStr = student._id.toString(); // Ensure it's a string because keys in attendance are strings
                if (!activeSessions?.attendance[studentIdStr]){
                  activeSessions!.attendance[studentIdStr] = "absent";
                  await MarkAttendance(parsed.data.classId, studentIdStr, "absent");
                }
              })
              const attendanceData = await GetAttendanceData();
              await endSession();
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN ) {
                  client.send(JSON.stringify(
                    {
                      "event": "SESSION_ENDED",
                      "data": {
                        "attendanceSummary": attendanceData,
                        "Message": "Attendance session ended successfully"
                      }
                    }
                  ))
                }
              })
              break;


            default:
              console.log("Unknown message type:", parsed.type);
          }
            
          }
          catch(err){
            console.error("Error processing message:", err);
          }
      })

      ws.send("WebSocket connection established and authenticated");
    }
    catch{
      ws.send(JSON.stringify({
        event: 'ERROR',
        data: {
          error: "Invalid token",
          message: "Authentication failed"
        }
      }))
      ws.close();
    }
  }
)

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true, // Allow cookies to be sent
}));

app.use('/api', routes);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
