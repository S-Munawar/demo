import { Router } from 'express';
import { Register, Login, Logout } from '../controllers/auth';
import { isRequired, TeacherOnly, StudentOnly } from '../middleware/auth';
import { profile, CreateClass, Classes, GetClass, Students, AddStudents, GetAttendance, StartAttendanceSession } from '../controllers/user';

const router: Router = Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);

// --------------------------------------------------------

router.get('/profile', isRequired, profile);

// --------------------------------------------------------

router.post('/createClass', isRequired, TeacherOnly, CreateClass); // Teacher only
router.get('/classes', isRequired, Classes); // Teacher only
router.post('/class/:id/add-student', isRequired, TeacherOnly, AddStudents); // Teacher only, must own the class
router.get('/class/:id', isRequired, GetClass); // Teacher only, must own the class
router.get('/class/:id/allStudents', isRequired, TeacherOnly, Students) // 
router.get('/class/:id/my-attendance', isRequired, StudentOnly, GetAttendance); // Student only, must be enrolled in class. Check MongoDB Attendance collection for persisted record
router.post('/attendance/start', isRequired, TeacherOnly, StartAttendanceSession); // Teacher only, must own the class

// --------------------------------------------------------

export default router;