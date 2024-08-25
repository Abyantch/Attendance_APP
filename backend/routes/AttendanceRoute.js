import express from "express";
import multer from "multer";
import path from "path";
import {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/Attendance.js";
import { VerifyUser } from "../middleware/AuthUser.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/attendance", VerifyUser, getAttendance);
router.get("/attendance/:id", VerifyUser, getAttendanceById);
router.post(
  "/attendance",
  VerifyUser,
  upload.single("image"),
  createAttendance
);
router.patch(
  "/attendance/:id",
  VerifyUser,
  upload.single("image"),
  updateAttendance
);
router.delete("/attendance/:id", VerifyUser, deleteAttendance);

export default router;
