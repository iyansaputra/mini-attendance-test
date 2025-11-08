# Mini Attendance System (Technical Test)

Ini adalah proyek *fullstack* lengkap yang mengimplementasikan sistem absensi mini dengan arsitektur *microservices* yang *event-driven* dan sepenuhnya berjalan di dalam Docker.

Proyek ini dibuat sebagai bagian dari *technical test* untuk posisi Fullstack Developer.

---

## 🚀 Fitur Utama

* **Autentikasi:** Registrasi dan Login User menggunakan **JWT (JSON Web Token)**.
* **Absensi:** Fungsi *endpoint* API untuk **Check-in** dan **Check-out**.
* **Aturan Bisnis:** Logika otomatis untuk mendeteksi status **Terlambat** atau **Pulang Cepat**.
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
git clone [https://github.com/iyansaputra/mini-attendance-test.git](https://github.com/iyansaputra/mini-attendance-test.git)
cd mini-attendance-test
