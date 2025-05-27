import Review from "../models/ReviewModel.js";
import Users from "../models/UserModel.js";
import Anime from "../models/AnimeModel.js";

// Create Review
export const createReview = async (req, res) => {
  const { rating, comment, animeId } = req.body;  // tambahkan animeId agar review terkait anime tertentu
  const userId = req.user.id;

  // Validasi input sederhana
  if (
    typeof rating !== "number" ||
    rating < 1 ||
    rating > 5 ||
    !comment ||
    comment.trim().length < 5 ||
    !animeId
  ) {
    return res.status(400).json({ message: "Input review tidak valid" });
  }

  try {
    const newReview = await Review.create({
      rating,
      comment: comment.trim(),
      userId,
      anime_id: animeId,
    });

    res.status(201).json({
      message: "Review berhasil dibuat",
      data: newReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update Review
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  if (
    (rating && (typeof rating !== "number" || rating < 1 || rating > 5)) ||
    (comment && comment.trim().length < 5)
  ) {
    return res.status(400).json({ message: "Input update review tidak valid" });
  }

  try {
    // Cari review dan pastikan milik user yang login
    const review = await Review.findOne({ where: { id, userId } });
    if (!review) {
      return res.status(404).json({ message: "Review tidak ditemukan atau bukan milik Anda" });
    }

    // Update field yang ada (partial update)
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment.trim();

    await review.save();

    res.status(200).json({
      message: "Review berhasil diupdate",
      data: review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getReview = async (req, res) => {
  const userId = req.user.id;

  try {
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: Anime,
          attributes: ["title"],  // hanya ambil kolom title dari Anime
        },
      ],
      order: [["created_at", "DESC"]],  // optional: urutkan terbaru dulu
    });

    res.status(200).json({
      message: "Review berhasil diambil",
      userId,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getReviewAll = async (req, res) => {
  const id = req.user.id;

  try {
    const review = await Review.findAll({});

    res.status(200).json({
      message: "Review berhasil diambil",
      userId: id,
      data: review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  console.log("ID NOTES = ", id);

  const userId = req.user.id;
  try {
    const review = await Review.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Review berhasil dihapus",
      userId,
      data: review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews by animeId
export const getReviewByAnimeId = async (req, res) => {
  const animeId = req.params.id;

  try {
    const reviews = await Review.findAll({
      where: { anime_id:animeId },
      include: [
        {
          model: Users,
          attributes: ["username", "id"], // hanya ambil username user
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      message: "Review berhasil diambil berdasarkan animeId",
      animeId,
      data: reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Review by ID
export const getReviewById = async (req, res) => {
  const { id } = req.params; // ambil id dari parameter URL
  const userId = req.user.id; // user yang sedang login, pastikan middleware auth sudah jalan

  try {
    // Cari review berdasarkan id dan userId (supaya review milik user tersebut)
    const review = await Review.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!review) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    res.status(200).json({
      message: "Review berhasil diambil",
      data: review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};