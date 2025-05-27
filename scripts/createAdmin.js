// scripts/createAdmin.js
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import db from "../config/Database.js";        // sesuaikan path Database.js
import Users from "../models/UserModel.js";    // sesuaikan path UserModel.js

dotenv.config();

async function createAdmin() {
  try {
    await db.authenticate(); // Pastikan koneksi database berhasil
    console.log("Database connected...");

    const username = "admin";     // Ganti sesuai keinginan
    const password = "admin123"; // Ganti sesuai keinginan
    const role = "0";                // 0 = admin

    // Cek apakah user admin sudah ada
    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      console.log("Username admin sudah ada:", username);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat akun admin baru
    const adminUser = await Users.create({
      username,
      password: hashedPassword,
      role,
    });

    console.log("Admin berhasil dibuat dengan username:", adminUser.username);
  } catch (error) {
    console.error("Gagal membuat admin:", error);
  } finally {
    await db.close(); // Tutup koneksi database
  }
}

createAdmin();
