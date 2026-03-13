# 🔄 UniSwap - Time Banking Platform

> **A Multi-Campus Peer-to-Peer (P2P) Skill Exchange Web Platform.**
> Built on the Time Banking model, UniSwap addresses the common financial constraints of university students by allowing them to leverage their personal skills as a universal currency.

---

## 📖 Project Overview
UniSwap breaks down the barriers of individual campuses, enabling students from different universities to connect, share expertise, and foster a diverse, transparent, and trust-based cross-institutional economy. Instead of spending cash, users earn and spend **Time-Credits** by offering and receiving services (e.g., IT support, language tutoring, graphic design).

### ✨ Key Features
* **Inter-University Skill Exchange:** Connect with peers across different campuses.
* **Time-Credit Escrow System:** Secure digital wallet that automatically holds and releases credits to ensure trust and prevent fraud.
* **Cross-Campus Trust & Safety:** Strict verification using university-issued emails (`@eiu.edu.vn`) and Google OAuth.
* **Role-Based Access Control:** Automated routing for Admin and Student Clients.

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
The repository is structured to separate frontend clients and backend services, promoting modularity and a clean code architecture.

```text
UniSwap_Project/
├── code/                         # ⚙️ BACKEND (Node.js / Express)
│   ├── database/
│   │   └── init_db.sql           # Database creation script
│   ├── src/
│   │   └── server.js             # Main Express server API
│   ├── .env                      # Environment variables (DB config, JWT Secret)
│   └── package.json
│
├── frontend/                     # 🎨 FRONTEND (React / Vite)
│   ├── src/
│   │   ├── App.jsx               # Main UI and Routing Logic
│   │   └── style.css             # Global Styles (Glassmorphism UI)
│   ├── .env                      # Environment variables (Google Client ID)
│   └── package.json
│
└── README.md                     # Project overview
```

---

## 🚀 Getting Started (How to run locally)

Follow these instructions to set up and run the UniSwap platform on your local machine.

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MySQL** Server (e.g., XAMPP, MySQL Workbench)
* **Git**

### Step 1: Database Setup
1. Open your MySQL client (e.g., phpMyAdmin, MySQL Workbench).
2. Create a new SQL query tab.
3. Copy the contents of `code/database/init_db.sql` and execute it. This will create the `uniswap_db` database and necessary tables.

### Step 2: Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd code
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `code/` root directory and add your configuration:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=uniswap_db
   JWT_SECRET=your_super_secret_jwt_key
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```
4. Start the backend server:
   ```bash
   node src/server.js
   ```
   *(Expected output: "Backend đang chạy tại http://localhost:5000")*

### Step 3: Frontend Setup
1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` root directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   VITE_API_URL=http://localhost:5000
   ```
4. Start the React development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5173`.

---

## 🧪 Testing Accounts
To test the Role-Based Access Control (RBAC):
* **Admin Access:** Register/Login using `tai.au.cit23@eiu.edu.vn`.
* **Client Access:** Register/Login using any other `@eiu.edu.vn` email.
* *Note: Emails outside the `@eiu.edu.vn` domain will be rejected by the system.*

---

## 🔗 Important Links
* [**Jira Board**](https://auduongtai27.atlassian.net/jira/software/projects/UD/boards/34) - Active Sprint and Product Backlog.