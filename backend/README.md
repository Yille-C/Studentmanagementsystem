# Academic Analytics & Student Insights System - Backend

Complete Flask REST API backend for Student Management System with MySQL, NumPy analytics, Machine Learning predictions, and Matplotlib visualizations.

## 🎯 Features Implemented

### 1. **OOP Concepts** ✅
- `Person` base class
- `Student` class (inherits from Person)
- `HonorsStudent` class (inherits from Student)
- Demonstrates inheritance and polymorphism
- `ClassList` custom iterator for looping through students

### 2. **MySQL Database** ✅
- Complete CRUD operations for Students, Grades, and Attendance
- SQLAlchemy ORM models
- Foreign key relationships
- Automatic table creation

### 3. **JSON Data Persistence** ✅
- Export all data to JSON format
- Import JSON to repopulate database
- Full backup and restore functionality

### 4. **NumPy Analytics** ✅
- Mean, Median, Mode calculation
- Standard Deviation & Variance
- Min/Max grades
- Attendance percentage
- Class-wide and student-specific analytics

### 5. **Machine Learning** ✅
- Linear regression for grade prediction
- Polynomial regression support
- Trend analysis (improving/declining/stable)
- Confidence scoring
- Component-wise predictions

### 6. **Matplotlib Visualizations** ✅
- Grade distribution pie charts
- Grade progress line charts
- Attendance bar charts
- Subject comparison charts
- Class performance charts
- Returns base64-encoded PNG images

### 7. **REST API** ✅
- Complete RESTful API with JSON responses
- CORS enabled for frontend integration
- Error handling and validation
- 40+ API endpoints

---

## 📁 Project Structure

```
backend/
├── app.py                  # Main Flask application
├── config.py               # Configuration settings
├── database.py             # SQLAlchemy models (Students, Grades, Attendance)
├── models.py               # OOP classes (Person, Student, HonorsStudent, ClassList)
├── routes.py               # All API endpoints
├── analytics.py            # NumPy analytics functions
├── predictions.py          # Machine Learning predictions
├── visualizations.py       # Matplotlib chart generation
├── json_utils.py           # JSON import/export utilities
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore file
└── charts/                # Directory for chart storage
```

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- MySQL Server installed and running
- pip (Python package manager)

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure MySQL Database

1. Create a MySQL database:
```sql
CREATE DATABASE student_management;
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Edit `.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_management

FLASK_ENV=development
SECRET_KEY=your-secret-key-here
```

### Step 3: Run the Application

```bash
python app.py
```

The server will start on `http://localhost:5000`

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

### **Students**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| GET | `/students/<id>` | Get specific student with grades & attendance |
| POST | `/students` | Add new student |
| PUT | `/students/<id>` | Update student |
| DELETE | `/students/<id>` | Delete student |

### **Grades**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/grades` | Get all grades |
| GET | `/grades?studentId=<id>` | Get grades for specific student |
| POST | `/grades` | Add new grade |
| PUT | `/grades/<id>` | Update grade |
| DELETE | `/grades/<id>` | Delete grade |

### **Attendance**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | Get all attendance records |
| GET | `/attendance?studentId=<id>` | Get attendance for specific student |
| POST | `/attendance` | Add attendance record |
| DELETE | `/attendance/<id>` | Delete attendance record |

### **Analytics (NumPy)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/student/<id>` | Get analytics for specific student |
| GET | `/analytics/class` | Get class-wide analytics |
| GET | `/analytics/distribution` | Get grade distribution |
| GET | `/analytics/subject/<name>` | Get analytics for specific subject |

### **Predictions (ML)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/predictions/student/<id>?subject=<name>` | Predict student's next grade |
| GET | `/predictions/all` | Predict grades for all students |
| POST | `/predictions/custom` | Custom prediction with provided grades |

### **Charts (Matplotlib)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/charts/grade-distribution` | Grade distribution pie chart |
| GET | `/charts/grade-distribution?studentId=<id>` | Student's grade distribution |
| GET | `/charts/grade-progress/<id>` | Student's grade progress line chart |
| GET | `/charts/attendance` | Overall attendance bar chart |
| GET | `/charts/attendance?studentId=<id>` | Student's attendance chart |
| GET | `/charts/subject-comparison/<id>` | Student's subject comparison |
| GET | `/charts/class-performance` | Class performance chart |

### **Data Persistence (JSON)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/data/export` | Export all data to JSON |
| POST | `/data/import` | Import data from JSON |
| DELETE | `/data/clear` | Clear all data (use with caution!) |

### **Other**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/oop/demo` | Demonstrate OOP concepts |
| GET | `/health` | Health check |

---

## 🔌 Frontend Integration

### Example: Fetch All Students
```javascript
// Using fetch API
fetch('http://localhost:5000/api/students')
  .then(response => response.json())
  .then(data => {
    console.log(data.students);
  })
  .catch(error => console.error('Error:', error));
```

### Example: Add New Student
```javascript
fetch('http://localhost:5000/api/students', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 'S001',
    name: 'John Doe',
    email: 'john@example.com',
    course: 'Computer Science',
    enrollmentDate: '2024-01-15',
    age: 20,
    studentType: 'Regular'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Example: Add Grade
```javascript
fetch('http://localhost:5000/api/grades', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    studentId: 'S001',
    subject: 'Mathematics',
    midterm: 85,
    finals: 90,
    quizzes: 88,
    projects: 92
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Example: Get Student Analytics
```javascript
fetch('http://localhost:5000/api/analytics/student/S001')
  .then(response => response.json())
  .then(data => {
    console.log('Mean:', data.analytics.mean);
    console.log('GPA:', data.analytics.gpa);
    console.log('Attendance:', data.analytics.attendance_percentage);
  });
```

### Example: Get Grade Prediction
```javascript
fetch('http://localhost:5000/api/predictions/student/S001?subject=Mathematics')
  .then(response => response.json())
  .then(data => {
    console.log('Predicted Grade:', data.prediction.predicted_grade);
    console.log('Trend:', data.prediction.trend);
    console.log('Confidence:', data.prediction.confidence);
  });
```

### Example: Display Chart
```javascript
fetch('http://localhost:5000/api/charts/grade-distribution')
  .then(response => response.json())
  .then(data => {
    // data.chart contains base64 image
    const img = document.createElement('img');
    img.src = data.chart;
    document.body.appendChild(img);
  });
```

### Example: Export Data
```javascript
fetch('http://localhost:5000/api/data/export')
  .then(response => response.json())
  .then(data => {
    // Download as JSON file
    const blob = new Blob([JSON.stringify(data.data, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_data_backup.json';
    a.click();
  });
```

### Example: Import Data
```javascript
// Assuming you have JSON data
const jsonData = { /* your JSON data */ };

fetch('http://localhost:5000/api/data/import', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(jsonData)
})
.then(response => response.json())
.then(data => {
  console.log('Import stats:', data.stats);
});
```

---

## 📊 Request/Response Examples

### POST /api/students
**Request Body:**
```json
{
  "id": "S001",
  "name": "John Doe",
  "email": "john@example.com",
  "course": "Computer Science",
  "enrollmentDate": "2024-01-15",
  "age": 20,
  "studentType": "Regular"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student added successfully",
  "student": {
    "id": "S001",
    "name": "John Doe",
    "email": "john@example.com",
    "course": "Computer Science",
    "enrollmentDate": "2024-01-15",
    "age": 20,
    "studentType": "Regular",
    "scholarship": null
  }
}
```

### GET /api/analytics/student/S001
**Response:**
```json
{
  "success": true,
  "analytics": {
    "student_id": "S001",
    "total_subjects": 5,
    "mean": 87.5,
    "median": 88.0,
    "mode": 90.0,
    "std_deviation": 3.2,
    "variance": 10.24,
    "min_grade": 82.5,
    "max_grade": 92.0,
    "attendance_percentage": 95.5,
    "gpa": 3.5
  }
}
```

### GET /api/predictions/student/S001?subject=Mathematics
**Response:**
```json
{
  "success": true,
  "prediction": {
    "predicted_grade": 91.5,
    "slope": 2.3,
    "intercept": 78.5,
    "r_squared": 0.85,
    "trend": "improving",
    "confidence": "high",
    "past_grades": [80, 85, 88, 90],
    "periods_predicted": 1,
    "student_id": "S001",
    "subject": "Mathematics"
  }
}
```

---

## 🧪 Testing the API

### Using cURL:

```bash
# Get all students
curl http://localhost:5000/api/students

# Add a student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"id":"S001","name":"John Doe","email":"john@example.com","course":"CS","enrollmentDate":"2024-01-15"}'

# Get analytics
curl http://localhost:5000/api/analytics/class
```

### Using Python requests:

```python
import requests

# Get all students
response = requests.get('http://localhost:5000/api/students')
print(response.json())

# Add a grade
data = {
    'studentId': 'S001',
    'subject': 'Mathematics',
    'midterm': 85,
    'finals': 90,
    'quizzes': 88,
    'projects': 92
}
response = requests.post('http://localhost:5000/api/grades', json=data)
print(response.json())
```

---

## 🎓 OOP Demonstration

The backend includes a demonstration of OOP concepts:

```python
# Access via: GET /api/oop/demo

# Returns demonstration of:
# - Inheritance: Student inherits from Person, HonorsStudent inherits from Student
# - Polymorphism: get_info() behaves differently for each class
# - Iterator: ClassList implements __iter__ and __next__
```

---

## 🔒 Security Notes

- Change `SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable authentication/authorization for production use
- Restrict CORS origins in production
- Use HTTPS in production

---

## 🐛 Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database exists

### Module Not Found Error
- Run `pip install -r requirements.txt`
- Ensure you're in the correct Python environment

### CORS Error
- Backend has CORS enabled by default
- Check if backend is running
- Verify frontend is making requests to correct URL

### Port Already in Use
- Change port in `.env`: `PORT=5001`
- Or stop the process using port 5000

---

## 📦 Dependencies

- **Flask** - Web framework
- **Flask-CORS** - CORS support
- **Flask-SQLAlchemy** - ORM for database
- **PyMySQL** - MySQL driver
- **NumPy** - Analytics calculations
- **Matplotlib** - Chart generation
- **python-dotenv** - Environment variables

---

## 🚀 Production Deployment

1. Set `FLASK_ENV=production` in `.env`
2. Use a production WSGI server (gunicorn):
   ```bash
   pip install gunicorn
   gunicorn -w 4 app:app
   ```
3. Configure nginx or Apache as reverse proxy
4. Use a production MySQL server
5. Enable HTTPS

---

## 📝 Notes

- All charts are returned as base64-encoded PNG images
- Grades are calculated with weights: Midterm 25%, Finals 35%, Quizzes 20%, Projects 20%
- Predictions require at least 2 historical grades
- Database tables are created automatically on first run

---

## 👨‍💻 API Response Format

All endpoints follow this format:

**Success:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🎯 Python Subject Requirements Coverage

✅ **OOP** - Person, Student, HonorsStudent classes with inheritance  
✅ **MySQL** - Complete database with CRUD operations  
✅ **JSON** - Import/Export functionality  
✅ **NumPy** - Analytics (mean, median, mode, std, min/max)  
✅ **ML** - Linear regression prediction  
✅ **Matplotlib** - Multiple chart types  
✅ **REST API** - 40+ endpoints with JSON responses  
✅ **Iterator** - ClassList custom iterator  
✅ **Polymorphism** - get_info() method overriding  

---

## 📞 Support

For issues or questions, refer to the code comments or check:
- Flask documentation: https://flask.palletsprojects.com/
- SQLAlchemy documentation: https://docs.sqlalchemy.org/
- NumPy documentation: https://numpy.org/doc/

---

**Ready to integrate with your frontend! 🎉**
