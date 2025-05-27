import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register user baru (role default 1 = user biasa)
export const Register = async (req, res) => {
  const { username, password, confirm_password, role } = req.body;

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Password tidak sama" });
  }

  try {
    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username sudah terdaftar" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      username,
      password: hashPassword,
      role: role !== undefined ? role : 1, // default user biasa
    });

    res.status(201).json({
      message: "User berhasil dibuat",
      data: { id: newUser.id, username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan pada server",
      error: error.message,
    });
  }
};

// Login user dan buatkan JWT termasuk role
export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Simpan refresh token di DB
    await Users.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );

    // Kirim refresh token sebagai HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Kirim access token ke client
    res.status(200).json({
      accessToken,
      message: "Login berhasil",
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan pada server",
      error: error.message,
    });
  }
};

// Refresh access token dengan refresh token dari cookie
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(401); // Unauthorized

    const user = await Users.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!user) return res.sendStatus(403); // Forbidden

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });

      res.json({ accessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan pada server",
      error: error.message,
    });
  }
};

// Logout user: hapus refresh token di DB dan cookie
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(204); // No content, sudah logout

    const user = await Users.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!user) return res.sendStatus(204);

    await Users.update({ refresh_token: null }, { where: { id: user.id } });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan pada server",
      error: error.message,
    });
  }
};

// Get user profile dari token (middleware verifyToken harus isi req.user)
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Users.findOne({
      where: { id: userId },
      attributes: ["id", "username", "role"], // sertakan role juga
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
