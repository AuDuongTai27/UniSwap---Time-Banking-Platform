# 🔄 UniSwap - Time Banking Platform

> **A Multi-Campus Peer-to-Peer (P2P) Skill Exchange Web Platform.**
> Built on the Time Banking model, UniSwap addresses the common financial constraints of university students by allowing them to leverage their personal skills as a universal currency.

---

## 📖 Project Overview
UniSwap breaks down the barriers of individual campuses, enabling students from different universities to connect, share expertise, and foster a diverse, transparent, and trust-based cross-institutional economy. Instead of spending cash, users earn and spend **Time-Credits** by offering and receiving services (e.g., IT support, language tutoring, graphic design).

### ✨ Key Features
* **Inter-University Skill Exchange:** Connect with peers across different campuses.
* **Time-Credit Escrow System:** Secure digital wallet that automatically holds and releases credits to ensure trust and prevent fraud.
* **Remote & In-Person Collaboration:** Built-in tools to support flexible meeting options.
* **Cross-Campus Trust & Safety:** Strict verification using university-issued emails (`@eiu.edu.vn`) and academic transcripts to earn "Verified" badges.

---

## 👥 Team Members & Roles (Software Engineering)
We operate using the Agile/Scrum framework to ensure continuous delivery and high-quality outputs.

| Role | Name |
| :--- | :--- |
| **Product Owner (PO)** | **Nguyễn Thị Diễm My** |
| **Scrum Master (SM)** | **Trần Mạnh Tuấn** |
| **Business Analyst (BA)** | **Huỳnh Khánh Duy** |
| **UX Designer (UX)** | **Hoàng Quốc Việt** |
| **Tech Lead / Architect (TL)** | **Âu Dương Tài** |
| **Frontend Developer** | **Nguyễn Minh Mẫn** |

---

## 🛠️ Tech Stack & Tools
✅ **Status: MVP Phase 1 (Authentication & Architecture)**

**Frontend:**
* React.js (Vite)
* React Router v6 (Routing)
* Axios (HTTP Client)
* Google OAuth 2.0 (`@react-oauth/google`)

**Backend:**
* Node.js & Express.js
* MySQL (Raw SQL with `mysql2` connection pool)
* JWT (JSON Web Tokens) & bcrypt (Password Hashing)
* Google Auth Library


---

## 📂 Project Structure
> ✅ **Status: Initialized (Sprint 2)**

The repository is structured to separate documentation, frontend clients, and backend services, promoting modularity and a clean code architecture.

```text
uniswap-platform/
├── .github/                      # CI/CD workflows and GitHub actions
├── docs/                         # Project Documentation
│   ├── agile_documents/          # Daily Stand-ups, Sprint Review records
│   ├── architecture/             # ADRs, C4 Context & Container diagrams
│   └── database/                 # ERD schemas, Escrow logic flowcharts
├── frontend/                     # Web Client application (UI components, pages, services)
├── backend/                      # REST API services, Database context, Escrow logic
├── .gitignore                    # Ignored files (node_modules, bin, obj, etc.)
└── README.md                     # Project overview
```
---

## 🛠️ Tech Stack & Tools
*(Note: To be finalized after the planning phase)*

⚠️ **Status: Currently in Planning Phase**

---

## 🔗 Important Links
* [**Jira Board**](https://auduongtai27.atlassian.net/jira/software/projects/UD/boards/34) - Active Sprint and Product Backlog.

# 🎓 Hướng Dẫn Cài Đặt & Khởi Chạy Dự Án UniSwap

Để clone dự án về và chạy thử trên máy cá nhân (Localhost),mọi người làm đúng theo thứ tự 8 bước sau nhé:

## 🗄️ Phẩn 1: Setup Database
**1.** Mở MySQL, sau đó mở file script `backend/database/init_db.sql` lên, **nhớ tìm đến dòng INSERT tài khoản Admin và sửa lại thành email trường (@eiu.edu.vn) của chính mình**, rồi chạy (execute) toàn bộ script đó để tạo bảng.

---

## ⚙️ Phần 2: Khởi chạy Backend
**2.** Mở Terminal, di chuyển vào thư mục backend và cài đặt thư viện:
```bash
cd backend
npm install
```
### 3. Tạo file `.env`

Trong thư mục **backend**, tạo một file tên **`.env`** nằm cùng cấp với `server.js`.  
Sau đó thêm nội dung sau và **điền mật khẩu MySQL của bạn**:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mat_khau_mysql_cua_ban
DB_NAME=uniswap_db
JWT_SECRET=uniswap_super_secret_key_2026
GOOGLE_CLIENT_ID=nhap_google_client_id_cua_team_vao_day.apps.googleusercontent.com
```
### 4. Chạy server Backend:

Bash

```node server.js```

(Cứ để terminal này chạy ngầm)

## 🎨 Phần 3: Khởi chạy Frontend
###  5. Mở một Terminal mới, di chuyển vào thư mục frontend:

Bash
```
cd frontend
```

### 6. Cài đặt thư viện cho Frontend (Lưu ý phải có cờ --legacy-peer-deps để tránh lỗi xung đột React 19):

Bash
```
npm install --legacy-peer-deps
```

### 7. Tạo file .env bên trong thư mục frontend (nằm cùng cấp với file package.json), và thêm key Google Auth vào:

Đoạn mã
```
VITE_GOOGLE_CLIENT_ID=nhap_google_client_id_cua_team_vao_day.apps.googleusercontent.com
```
### 8. Chạy giao diện Frontend:

Bash
```
npm run dev
```
👉 Mở trình duyệt và truy cập: http://localhost:5173 để trải nghiệm dự án!

## Phần 4: tạo key
### 9. Tạo client id (secret key nên tuyệt đối không được để lộ hay public)
Prompt AI
```
Bạn hãy hướng dẫn tôi chi tiết các bước để tạo Client ID và Client Secret trên Google Cloud Console nhằm tích hợp tính năng 'Đăng nhập bằng Google' cho ứng dụng web của tôi. Vui lòng bao gồm các bước: tạo dự án mới, cấu hình màn hình đồng ý OAuth (OAuth consent screen) ở chế độ 'External', kích hoạt API cần thiết, và cuối cùng là tạo OAuth 2.0 Client ID với loại ứng dụng là 'Web application'. Giải thích luôn ý nghĩa của các trường 'Authorized JavaScript origins' và 'Authorized redirect URIs' giúp tôi.
```
### 10. Tạo jwt
Bản đầy đủ để hiểu jwt
```
Hãy giải thích cho tôi JWT (JSON Web Token) là gì và cấu trúc của nó bao gồm (Header, Payload, Signature) hoạt động như thế nào. Sau đó, hãy hướng dẫn tôi cách tạo một JWT trong ứng dụng Node.js bằng thư viện jsonwebtoken. Minh họa cụ thể việc tạo token với thông tin payload chứa userId, sử dụng thuật toán HS256, kèm theo thời gian hết hạn (expiresIn). Giải thích luôn tầm quan trọng của việc lưu trữ secret key an toàn trong biến môi trường (.env).
```
Bản ngắn gọn để tạo jwt
```
Hãy hướng dẫn tôi cách tạo một JWT trong ứng dụng Node.js bằng thư viện jsonwebtoken.
```
