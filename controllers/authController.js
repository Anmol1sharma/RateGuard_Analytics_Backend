import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // ✅ No manual bcrypt hash needed (handled by model)
    const newUser = await User.create({ username, email, password });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ result: { username: newUser.username, email: newUser.email }, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: 'Something went wrong during signup' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await existingUser.comparePassword(password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ result: { username: existingUser.username, email: existingUser.email }, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Something went wrong during login' });
  }
};
