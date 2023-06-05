import Users from '../models/UserModels.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({ attributes: ['id', 'name', 'email'] });
    res.status(200).json({ users });
  } catch (error) {
    res.status(404).json({ msg: 'Users not found' });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({ where: { email: req.body.email } });
    const validPass = await bcrypt.compare(req.body.password, user[0].password);
    if (!validPass) return res.status(400).json({ error: 'Invalid password' });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15s' }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    await Users.update(
      { refresh_Token: refreshToken },
      { where: { id: userId } }
    );
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: 'Email not found' });
  }
};

export const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(204);
    const user = await Users.findAll({ where: { refresh_Token: refreshToken } });
    if (!user[0]) return res.status(204);
    const userId = user[0].id;
    await Users.update({refresh_Token: null}, {where: {id: userId}})
    res.clearCookie('refreshToken');
    res.status(200).json({ msg: 'User logged out' });
  } catch (error) {
    res.status(500).json({ error });
  }
}