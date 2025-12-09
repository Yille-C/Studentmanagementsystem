# Student Management System - Team Setup Guide

This guide will help your team members set up and run the Student Management System on their computers.

---

## Prerequisites

Before starting, make sure you have these installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Python** (v3.8 or higher) - [Download here](https://www.python.org/downloads/)
3. **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
4. **Git** - [Download here](https://git-scm.com/downloads/)
5. **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

---

## Step 1: Clone the Repository

Open a terminal/command prompt and run:

```bash
git clone https://github.com/Yille-C/Studentmanagementsystem.git
cd Studentmanagementsystem
```

---

## Step 2: Set Up MySQL Database

### Option A: Using MySQL Command Line

1. Open MySQL command line or MySQL Workbench
2. Login with your root credentials
3. Create the database:

```sql
CREATE DATABASE student_management;
```

4. Verify it was created:

```sql
SHOW DATABASES;
```

### Option B: Using phpMyAdmin

1. Open phpMyAdmin in your browser (usually http://localhost/phpmyadmin)
2. Click "New" to create a new database
3. Name it: `student_management`
4. Click "Create"

---

## Step 3: Backend Setup (Flask API)

### 3.1 Navigate to Backend Folder

```bash
cd backend
```

### 3.2 Install Python Dependencies

**For Windows (PowerShell):**
```powershell
pip install Flask Flask-CORS Flask-SQLAlchemy PyMySQL cryptography python-dotenv numpy matplotlib scikit-learn
```

### 3.3 Configure Database Connection

1. Create a `.env` file in the `backend` folder:

**For Windows:**
```powershell
Copy-Item .env.example .env
```

2. Open `.env` file and edit the database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=student_management
DB_USER=root
DB_PASSWORD=your_mysql_password_here

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-this-in-production (kahit ano lagay mo dito.)
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password. If you don't have a password, leave it empty:

"DB_PASSWORD="


### 3.4 Initialize Sample Data (Optional)

Load sample data into the database:

```bash
python init_sample_data.py
```

This creates 5 students with grades and attendance records for testing.

### 3.5 Start the Backend Server

```bash
python run.py
```

You should see:
```
✓ Database tables created successfully!
============================================================
🎓 STUDENT MANAGEMENT SYSTEM API
============================================================
📍 Environment: development
🗄️  Database: localhost:3306/student_management
🔗 CORS: Enabled for all origins
============================================================
 * Running on http://127.0.0.1:5000
```

**Keep this terminal running!** The backend server must stay running while testing.

---

## Step 4: Frontend Setup (React + Vite)

### 4.1 Open a New Terminal

Keep the backend terminal running and open a **NEW** terminal window.

### 4.2 Navigate to Project Root

```bash
cd Studentmanagementsystem
```

### 4.3 Install Node.js Dependencies

```bash
npm install
```

This will install all required packages (React, TypeScript, Vite, etc.)

### 4.4 Start the Frontend Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Step 5: Access the Application

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the Student Management System login page

**Default Test Credentials:**
- Username: `admin`
- Password: `admin123`

---

## Step 6: Verify Everything Works

### Backend Check ✅
- Backend terminal shows: `Running on http://127.0.0.1:5000`
- No error messages

### Frontend Check ✅
- Browser opens: `http://localhost:5173`
- Login page appears
- No console errors (press F12 to check)

### Database Check ✅
Run this command in the backend folder:
```bash
python view_students.py
```

You should see the list of students in the database.

or run mo to sa Mysql=

USE student_management;
SELECT * FROM students;
SELECT * FROM grades;
SELECT * FROM attendance;
