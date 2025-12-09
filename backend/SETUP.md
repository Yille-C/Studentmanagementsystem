# Quick Setup Guide

Follow these steps to get the backend running:

## Windows Setup

### 1. Install MySQL (if not installed)
Download from: https://dev.mysql.com/downloads/installer/

### 2. Create Database
```sql
-- Open MySQL Command Line or MySQL Workbench
CREATE DATABASE student_management;
```

### 3. Setup Backend
```powershell
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env

# Edit .env with your MySQL password
notepad .env
```

### 4. Update .env File
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=student_management

FLASK_ENV=development
SECRET_KEY=your-secret-key-change-this
```

### 5. Run the Backend
```powershell
# Start the Flask server
python app.py
```

The server will start on: http://localhost:5000

### 6. (Optional) Create Sample Data
```powershell
# In a new terminal, while the server is running
python init_sample_data.py
```

### 7. Test the API
```powershell
# In a new terminal
pip install requests
python test_api.py
```

## Verify Installation

Open your browser and visit:
- http://localhost:5000 - Should show API info
- http://localhost:5000/api/health - Should return health status
- http://localhost:5000/api/students - Should return students list

## Troubleshooting

### "Access denied for user"
- Check your MySQL password in .env
- Verify MySQL is running

### "No module named ..."
- Run: `pip install -r requirements.txt`

### "Port 5000 already in use"
- Add `PORT=5001` to .env file
- Or stop the process using port 5000

### "Can't connect to MySQL server"
- Ensure MySQL service is running
- Check MySQL is running on port 3306

## Next Steps

1. Keep the Flask server running (python app.py)
2. Update your frontend to call these API endpoints
3. See README.md for complete API documentation
4. See FRONTEND_INTEGRATION.md for frontend examples

---

**Backend is ready! Now connect your frontend! 🚀**
