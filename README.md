# QuantumGuard: Post-Quantum Cryptography Audit Platform

QuantumGuard is an advanced audit and analysis platform designed to identify legacy cryptographic algorithms (such as RSA, AES, SHA-1, MD5) in source code and suggest modern, post-quantum replacements (like CRYSTALS-Kyber, CRYSTALS-Dilithium, SHA-3) to ensure long-term data security in the post-quantum era.

The platform provides role-based access control with dashboards for **Administrators**, **Organizations**, and **Researchers**, complete with comprehensive scanning features, history logging, and custom notifications.

---

## 🛠️ Project Architecture

The application is structured into two main parts:
1. **Frontend (Root Directory)**: Built with **React** and **Vite**, offering a fast, responsive user interface styled with premium CSS aesthetics.
2. **Backend (`/server` Directory)**: Built with **Node.js** and **Express**, connecting to a **Microsoft SQL Server (MSSQL)** database to persist user accounts, scans, vulnerabilities, and system logs.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18.x or higher) & **npm**
- **Microsoft SQL Server** (local instance or SQLEXPRESS)
- **SQL Server Management Studio (SSMS)** (for running database setup scripts)

---

## 💾 Database Setup (MSSQL)

Follow these steps to initialize your database:

1. **Open SQL Server Management Studio (SSMS)** and connect to your SQL Server instance (e.g., `localhost\SQLEXPRESS`).
2. Open the query editor and open the SQL setup script located at `server/setup.sql`.
3. Run/Execute the entire script (`server/setup.sql`).
   - This script will automatically:
     - Create the database `PostQuantumDB` (if it does not exist).
     - Create the `Users` table (to manage accounts).
     - Create the `Scans` table (to record scan activities).
     - Create the `ScanVulnerabilities` table (to store detailed audit findings linked to each scan).
     - Create the `Notifications` table (for admin broadcasts).
     - Create the `vw_ScanSummary` database view for reporting.

---

## 🚀 Installation & Running

### 1. Backend Setup

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install all required dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory (you can copy the format below) and populate it with your SQL Server credentials:
   ```env
   PORT=5000
   DB_USER=your_mssql_username (e.g., sa)
   DB_PASSWORD=your_mssql_password
   DB_SERVER=your_server_name (e.g., localhost\SQLEXPRESS or localhost)
   DB_DATABASE=PostQuantumDB
   DB_TRUST_CERT=true
   ```
   > **Note:** If you use a backslash in your server name (like `localhost\SQLEXPRESS`), use a double backslash (`localhost\\SQLEXPRESS`) in the `.env` configuration file to escape it properly.

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will start running at `http://localhost:5000`. You should see:
   `✅ Connected to MSSQL Database`
   `🚀 Server running on http://localhost:5000`

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the root directory of the project:
   ```bash
   # (If you are in the server directory, run: cd ..)
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the provided local URL in your browser (usually `http://localhost:5173`).

---

## 🔑 Login & Roles

The system uses role-based landing pages and dashboards. You can register new accounts under **Organization** or **Researcher** roles directly from the Register page.

### 🛡️ Admin Portal Access
For testing, a system-level administrator account has been pre-configured with the following exclusive credentials:
- **Role**: `admin`
- **Email**: `admin@postquantum.com`
- **Password**: `123456`

---

## 📁 Repository Structure

```
├── public/                 # Static assets for the frontend
├── src/
│   ├── assets/             # Images, icons, and banners
│   ├── components/         # React Components
│   │   ├── Admin/          # Admin Dashboard & Notification controls
│   │   ├── Organization/   # Organization Dashboard & scans
│   │   ├── Researcher/     # Researcher scanning interface
│   │   ├── Auth.jsx        # Handles registration and login actions
│   │   ├── Dashboard.jsx   # High-level Router/Dashboard distributor
│   │   ├── Scanner.jsx     # PQC Vulnerability scanner engine
│   │   └── ...             # Other modular view components
│   ├── index.css           # Premium core CSS design tokens
│   ├── main.jsx            # Entry point for React app
│   └── App.jsx             # App layout & styling wrappers
├── server/
│   ├── index.js            # Main Express server and API routing logic
│   ├── db.js               # Database helper setup and MSSQL connection pooling
│   ├── setup.sql           # Database schema definition query script
│   ├── package.json        # Backend dependencies lists
│   └── .env                # Env variables configuration (ignored by Git)
├── package.json            # Root frontend npm configuration file
└── README.md               # Setup & configuration guide
```

---

## 🛡️ License & Copyright

Copyright © 2026 Mohammed Faraz. All rights reserved.

This project is **proprietary software** and all rights are strictly reserved.

**Limited Recruiter & Evaluator License:**
Permission is hereby granted, free of charge, to recruiters, hiring managers, potential employers, academic evaluators, and security researchers ("Evaluators") to download, view, compile, and run this project locally for the sole, non-commercial purpose of evaluating the professional capabilities, technical skills, and coding standards of the author.

Any other use, including but not limited to reproduction, distribution, modification, commercial usage, or hosting on other public platforms, is strictly prohibited without explicit written permission from the author. For full terms, please refer to the [LICENSE](LICENSE) file.

