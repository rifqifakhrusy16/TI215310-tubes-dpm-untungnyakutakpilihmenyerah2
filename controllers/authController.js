const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek jika email sudah digunakan
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({ email, password });
    const token = generateToken(user._id);
    res.status(201).json({ user: { id: user._id, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ user: { id: user._id, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
