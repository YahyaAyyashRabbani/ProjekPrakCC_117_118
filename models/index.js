import db from "../config/Database.js";
import Users from "./UserModel.js";
import Anime from "./AnimeModel.js";
import Review from "./ReviewModel.js";

// Relasi
Users.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });
Review.belongsTo(Users, { foreignKey: "userId" });
Review.belongsTo(Anime, { foreignKey: "anime_id" });
Anime.hasMany(Review, { foreignKey: "anime_id", onDelete: "CASCADE" });

// Sinkronisasi semua tabel
(async () => {
  try {
    await db.authenticate();
    console.log("Koneksi database berhasil!");

    await db.sync({ alter: true });
    console.log("Semua tabel berhasil disinkronisasi.");
  } catch (err) {
    console.error("Gagal konek DB:", err);
  }
})();

export { Users, Review, Anime };