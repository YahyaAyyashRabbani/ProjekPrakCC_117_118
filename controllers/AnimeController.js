import Anime from "../models/AnimeModel.js";

// Buat anime baru
export const createAnime = async (req, res) => {
  console.log("Body diterima:", req.body); // debug
  const { title, description, genre, year, img_URL } = req.body;

  if (!title || !description || !genre || !year || !img_URL) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  try {
    const anime = await Anime.create({
      title,
      description,
      genre,
      year,
      img_URL,
    });

    res.status(201).json({
      message: "Anime berhasil dibuat",
      data: anime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan pada server",
      error: error.message,
    });
  }
};

// Ambil semua anime
export const getAnime = async (req, res) => {
  try {
    const animeList = await Anime.findAll();
    res.status(200).json({
      message: "Daftar anime berhasil diambil",
      data: animeList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan pada server",
      error: error.message,
    });
  }
};

// Ambil anime berdasarkan ID
export const getAnimeById = async (req, res) => {
  const { id } = req.params;

  try {
    const anime = await Anime.findByPk(id);

    if (!anime) {
      return res.status(404).json({ message: "Anime tidak ditemukan" });
    }

    res.status(200).json({
      message: "Anime berhasil diambil",
      data: anime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan pada server",
      error: error.message,
    });
  }
};

// Update anime berdasarkan ID
export const updateAnime = async (req, res) => {
  const { id } = req.params;
  const { title, description, genre, year, img_URL } = req.body;

  try {
    const anime = await Anime.findByPk(id);
    if (!anime) {
      return res.status(404).json({ message: "Anime tidak ditemukan" });
    }

    await anime.update({ title, description, genre, year, img_URL });

    res.status(200).json({
      message: "Anime berhasil diupdate",
      data: anime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan pada server",
      error: error.message,
    });
  }
};

// Hapus anime berdasarkan ID
export const deleteAnime = async (req, res) => {
  const { id } = req.params;

  try {
    const anime = await Anime.findByPk(id);

    if (!anime) {
      return res.status(404).json({ message: "Anime tidak ditemukan" });
    }

    await anime.destroy();

    res.status(200).json({
      message: "Anime berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan pada server",
      error: error.message,
    });
  }
};
