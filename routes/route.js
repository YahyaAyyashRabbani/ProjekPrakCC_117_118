import express from "express";
import {
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getReviewByAnimeId,
  getReviewById,
  getReviewAll,
} from "../controllers/ReviewController.js";
import {
  Register,
  Login,
  refreshToken,
  logout,
  getUserProfile,
} from "../controllers/UserController.js";
import {
  createAnime,
  getAnime,
  updateAnime,
  deleteAnime,
  getAnimeById,
} from "../controllers/AnimeController.js";
import { verifyToken, verifyAdmin } from "../middleware/VerifyToken.js";

const router = express.Router();

// User Routes
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", logout);
router.get("/user", verifyToken, getUserProfile);

// Review Routes (user bisa create, update, delete review sendiri)
router.get("/review", verifyToken, getReview);
router.get("/review-all", verifyToken, getReviewAll);
router.get("/review/:id", verifyToken, getReviewById);
router.get("/review-anime/:id", verifyToken, getReviewByAnimeId);
router.post("/add-review", verifyToken, createReview);
router.put("/update-review/:id", verifyToken, updateReview);
router.delete("/delete-review/:id", verifyToken, deleteReview);

// Anime Routes (hanya admin boleh add, update, delete anime)
router.get("/anime", verifyToken, getAnime);
router.get("/anime/:id", verifyToken, getAnimeById);
router.post("/add-anime", verifyToken, verifyAdmin, createAnime);
router.put("/update-anime/:id", verifyToken, verifyAdmin, updateAnime);
router.delete("/delete-anime/:id", verifyToken, verifyAdmin, deleteAnime);

// Jika route tidak ditemukan
router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
