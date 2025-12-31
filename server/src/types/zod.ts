import { z } from "zod";

/* =======================
   USER
======================= */
export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6), // ✅ FIXED
  role: z.enum(["teacher", "student"]), // ✅ FIXED
});

/* =======================
   CLASS
======================= */
export const classSchema = z.object({
  className: z.string().min(1),
  teacherId: z.string(), // ✅ FIXED (ObjectId = string)
  studentIds: z.array(z.string()), // ✅ FIXED
});

/* =======================
   ATTENDANCE
======================= */
export const attendanceSchema = z.object({
  classId: z.string(), // ✅ FIXED
  studentId: z.string(), // ✅ FIXED
  status: z.enum(["present", "absent"]), // ✅ BETTER
  date: z.coerce.date(), // ✅ handles string → Date
});

/* =======================
   TYPES
======================= */
export type UserType = z.infer<typeof userSchema>;
export type ClassType = z.infer<typeof classSchema>;
export type AttendanceType = z.infer<typeof attendanceSchema>;
