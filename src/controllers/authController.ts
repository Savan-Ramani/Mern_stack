import { Request, Response } from 'express';
import User from '../models/User';
import { signJwt } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.status(409).json({ error: 'User already exists' });

  const user = new User({ email, password });
  await user.save();

  const token = signJwt({ id: user._id, email });
  res.status(201).json({ token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signJwt({ id: user._id, email });
  res.json({ token });
};
