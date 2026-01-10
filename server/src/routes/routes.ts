import { Router } from 'express';
import { Register, Login, Logout } from '../controllers/auth';
import { isRequired, TeacherOnly, StudentOnly } from '../middleware/auth';
import { profile, CreateClass } from '../controllers/user';


const router: Router = Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);

// --------------------------------------------------------

router.get('/profile', isRequired, profile);

// --------------------------------------------------------

router.post('/createClass', isRequired, TeacherOnly, CreateClass); // Teacher only
router.post('/addStudent', isRequired, TeacherOnly); // Teacher only, must own the class
router.get('/getClass', isRequired, ); // Teacher who owns class OR Student enrolled in class. Populate students array with full user details
router.post('/getStudents', isRequired, TeacherOnly); // Teacher only. Returns all users with role "student"
router.get('/my-attendance', isRequired, StudentOnly); // Student only, must be enrolled in class. Check MongoDB Attendance collection for persisted record
router.post('/attendanceStart', isRequired, TeacherOnly); // Teacher only, must own the class. Starts a new attendance session. Sets the active class in memory. Only one session can be active at a time.

// --------------------------------------------------------

export default router;