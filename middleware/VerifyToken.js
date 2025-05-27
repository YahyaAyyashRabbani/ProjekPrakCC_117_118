import jwt from "jsonwebtoken";

// Middleware verifikasi token (autentikasi)
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden (token invalid/expired)

    req.user = decoded; // { id, username, role, iat, exp }
    next();
  });
};

// Middleware verifikasi role admin (otorisasi)
export const verifyAdmin = (req, res, next) => {
  // Pastikan verifyToken sudah jalan dulu, jadi req.user tersedia
  if (!req.user) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  if (req.user.role !== 0) { // 0 = admin
    return res.status(403).json({ message: "Akses hanya untuk admin" });
  }

  next();
};
