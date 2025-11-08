# Mini Attendance System (Technical Test)

Ini adalah proyek *fullstack* lengkap yang mengimplementasikan sistem absensi mini dengan arsitektur *microservices* yang *event-driven* dan sepenuhnya berjalan di dalam Docker.

Proyek ini dibuat sebagai bagian dari *technical test* untuk posisi Fullstack Developer.

---

## 🚀 Fitur Utama

* **Autentikasi:** Registrasi dan Login User menggunakan **JWT (JSON Web Token)**.
* **Absensi:** Fungsi *endpoint* API untuk **Check-in** dan **Check-out**.
* **Aturan Bisnis:** Logika otomatis untuk mendeteksi status **Terlambat** atau **Pulang Cepat** (sesuai jam kerja 09:00 - 17:00).
* **Arsitektur Event-Driven:** Proses Check-in/Out bersifat **asinkron**. API utama (`main-service`) hanya mencatat *event* ke **RabbitMQ**, sementara *service* terpisah (`report-service`) memproses *event* tersebut untuk membuat laporan.
* **Laporan:** API `GET /report` dengan fitur *filter* berdasarkan tanggal dan status.
* **Frontend:** Antarmuka pengguna (UI) yang dibuat dengan **React.js** untuk login, absensi, dan melihat laporan.
* **Dockerisasi:** Seluruh 6 *service* (API, Worker, Frontend, DB, Broker, Cache) disatukan menggunakan **Docker Compose**.

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
| :--- | :--- |
| **Backend API** | Node.js (TypeScript), Express.js, Prisma, JWT, Bcrypt |
| **Backend Worker** | Node.js (TypeScript), Prisma |
| **Frontend** | React.js (TypeScript), Vite, Axios |
| **Database** | MySQL |
| **Message Broker** | RabbitMQ |
| **Cache** | Redis |
| **Web Server (Frontend)** | Nginx (di dalam Docker) |
| **Deployment** | Docker & Docker Compose |

---

## ⚡️ Cara Menjalankan (Instalasi)

Proyek ini 100% di-kontainerisasi. Anda **tidak perlu** menginstal Node.js, MySQL, atau RabbitMQ di laptop Anda.

**Satu-satunya prasyarat** adalah **Docker Desktop** yang terinstal dan berjalan.

### Langkah 1: Clone Repository

```bash
git clone https://github.com/iyansaputra/mini-attendance-test.git
cd mini-attendance-test
```

### Langkah 2: Jalankan Docker Compose
Pastikan Docker Desktop Anda sedang berjalan (Running). Kemudian, jalankan perintah ini dari root folder proyek:

```bash
docker compose up --build
```

* --build diperlukan untuk membangun image main-service, report-service, dan frontend-service untuk pertama kalinya.
* Proses ini akan mengunduh semua image (MySQL, Nginx, Node), menginstal semua dependencies (npm install), dan menyalakan semua 6 service. Ini mungkin memakan waktu 5-10 menit saat pertama kali.

### Langkah 3: Akses Aplikasi
Setelah semua service berjalan (log di terminal sudah stabil), Anda bisa mengakses:

* Aplikasi Frontend (UI): http://localhost (Port 80)
* API Backend: http://localhost:3001
* RabbitMQ Dashboard: http://localhost:15672 (User: guest, Pass: guest)
* Database (via DBeaver/etc): Host: localhost, Port: 3307, User: root, Pass: rootpassword

Untuk Menghentikan Proyek
Tekan Ctrl + C di terminal Anda (jika terminal terkunci log), lalu jalankan:

```bash
docker compose down
```
## 📄 Dokumentasi API

Koleksi Postman yang berisi semua endpoint API (Register, Login, Check-in, Check-out, Get Report):

[Download Postman Collection](https://github.com/iyansaputra/mini-attendance-test/blob/main/Mini%20Attendance.postman_collection.json)

