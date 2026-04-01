const Student = require('../models/Student');

exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    return res.status(201).json(student);
  } catch (err) {
    return next(err);
  }
};
exports.getStudents = async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  return res.json(students);
};
exports.updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  return res.json(student);
};
exports.deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  return res.json({ message: 'Student deleted' });
};
