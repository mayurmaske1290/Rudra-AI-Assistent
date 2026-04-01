const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');

const signToken = (admin) => jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const existing = await Admin.findOne({ email: req.body.email });
  if (existing) return res.status(409).json({ message: 'Admin already exists' });

  const admin = await Admin.create(req.body);
  return res.status(201).json({ token: signToken(admin), admin: { name: admin.name, email: admin.email } });
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin || !(await admin.comparePassword(req.body.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  return res.json({ token: signToken(admin), admin: { name: admin.name, email: admin.email } });
};
