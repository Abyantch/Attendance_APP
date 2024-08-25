import Attendance from "../models/AttendanceModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getAttendance = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Attendance.findAll({
        attributes: [
          "uuid",
          "name",
          "date",
          "check_in_time",
          "check_out_time",
          "image",
          "role",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Attendance.findAll({
        attributes: [
          "uuid",
          "name",
          "date",
          "check_in_time",
          "check_out_time",
          "image",
          "role",
        ],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!attendance) return res.status(404).json({ msg: "Data not found" });
    let response;
    if (req.role === "admin") {
      response = await Attendance.findOne({
        attributes: [
          "uuid",
          "name",
          "date",
          "check_in_time",
          "check_out_time",
          "image",
          "role",
        ],
        where: {
          id: attendance.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Attendance.findOne({
        attributes: [
          "uuid",
          "name",
          "date",
          "check_in_time",
          "check_out_time",
          "image",
          "role",
        ],
        where: {
          [Op.and]: [{ id: attendance.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createAttendance = async (req, res) => {
  const { name, date, check_in_time, check_out_time, role } = req.body;

  const image = req.file ? req.file.filename : null; 

  try {
    await Attendance.create({
      name: name,
      date: date,
      check_in_time: check_in_time,
      check_out_time: check_out_time,
      image: image,
      role: role,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Attendance created successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!attendance) return res.status(404).json({ msg: "Data not found" });

    const { name, date, check_in_time, check_out_time, role } = req.body;

    const image = req.file ? req.file.filename : attendance.image; 

    if (req.role === "admin") {
      await Attendance.update(
        {
          name: name,
          date: date,
          check_in_time: check_in_time,
          check_out_time: check_out_time,
          image: image,
          role: role,
        },
        {
          where: {
            id: attendance.id,
          },
        }
      );
    } else {
      if (req.userId !== attendance.userId)
        return res.status(403).json({ msg: "You are not authorized" });
      await Attendance.update(
        {
          name: name,
          date: date,
          check_in_time: check_in_time,
          check_out_time: check_out_time,
          image: image,
          role: role,
        },
        {
          where: {
            [Op.and]: [{ id: attendance.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Attendance updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!attendance) return res.status(404).json({ msg: "Data not found" });
    if (req.role === "admin") {
      await Attendance.destroy({
        where: {
          id: attendance.id,
        },
      });
    } else {
      if (req.userId !== attendance.userId)
        return res.status(403).json({ msg: "You are not authorized" });
      await Attendance.destroy({
        where: {
          [Op.and]: [{ id: attendance.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
