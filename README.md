# Backend Review Anime

Backend dari aplikasi review anime yang mencakup autentikasi pengguna, pengelolaan data anime, dan review.

---
## Auth Routes

| Metode | Endpoint     | Deskripsi                                                                 |
|--------|--------------|--------------------------------------------------------------------------|
| POST   | `/register`  | Mendaftarkan pengguna baru.                                              |
| POST   | `/login`     | Autentikasi pengguna dan mengembalikan access token.                     |
| GET    | `/token`     | Mendapatkan access token baru menggunakan refresh token.                 |
| DELETE | `/logout`    | Logout dan hapus session token.                                          |
| GET    | `/user`      | Mendapatkan profil pengguna (perlu token valid).                         |

---

## Review Routes

> Semua endpoint review memerlukan token valid (`verifyToken`)

| Metode | Endpoint               | Deskripsi                                                            |
|--------|------------------------|-----------------------------------------------------------------------|
| GET    | `/review`              | Mendapatkan semua review milik user yang sedang login.              |
| GET    | `/review-all`          | Mendapatkan seluruh review dari semua user (untuk dashboard, dll).  |
| GET    | `/review/:id`          | Mendapatkan review berdasarkan ID.                                   |
| GET    | `/review-anime/:id`    | Mendapatkan review berdasarkan ID anime tertentu.                    |
| POST   | `/add-review`          | Menambahkan review baru.                                            |
| PUT    | `/update-review/:id`   | Memperbarui review tertentu (hanya milik sendiri).                  |
| DELETE | `/delete-review/:id`   | Menghapus review tertentu (hanya milik sendiri).                    |

---

## Anime Routes

> Hanya pengguna dengan peran admin (`verifyAdmin`) yang bisa menambahkan, memperbarui, atau menghapus anime

| Metode | Endpoint               | Deskripsi                                               |
|--------|------------------------|----------------------------------------------------------|
| GET    | `/anime`               | Mendapatkan daftar semua anime.                         |
| GET    | `/anime/:id`           | Mendapatkan detail anime berdasarkan ID.                |
| POST   | `/add-anime`           | Menambahkan data anime baru (hanya admin).             |
| PUT    | `/update-anime/:id`    | Memperbarui data anime (hanya admin).                  |
| DELETE | `/delete-anime/:id`    | Menghapus anime berdasarkan ID (hanya admin).          |

---

## Fallback Route

| Metode | Endpoint | Deskripsi                      |
|--------|----------|-------------------------------|
| *      | `*`      | Mengembalikan error jika route tidak ditemukan. |

---



