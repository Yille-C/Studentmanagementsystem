"""
Database Models using SQLAlchemy
Defines MySQL table structures for Students, Grades, and Attendance
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class StudentDB(db.Model):
    """MySQL table for students"""
    __tablename__ = 'students'
    
    student_id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    age = db.Column(db.Integer, nullable=True)
    course = db.Column(db.String(100), nullable=False)
    enrollment_date = db.Column(db.String(50), nullable=False)
    student_type = db.Column(db.String(20), default='Regular')  # 'Regular' or 'Honors'
    scholarship = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    grades = db.relationship('GradeDB', backref='student', lazy=True, cascade='all, delete-orphan')
    attendance = db.relationship('AttendanceDB', backref='student', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.student_id,
            'name': self.name,
            'email': self.email,
            'age': self.age,
            'course': self.course,
            'enrollmentDate': self.enrollment_date,
            'studentType': self.student_type,
            'scholarship': self.scholarship
        }
    
    def __repr__(self):
        return f'<Student {self.name}>'


class GradeDB(db.Model):
    """MySQL table for grades"""
    __tablename__ = 'grades'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.String(50), db.ForeignKey('students.student_id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    midterm = db.Column(db.Float, default=0.0)
    finals = db.Column(db.Float, default=0.0)
    quizzes = db.Column(db.Float, default=0.0)
    projects = db.Column(db.Float, default=0.0)
    final_grade = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def calculate_final_grade(self):
        """Calculate weighted final grade"""
        # Weights: Midterm 25%, Finals 35%, Quizzes 20%, Projects 20%
        self.final_grade = (
            self.midterm * 0.25 +
            self.finals * 0.35 +
            self.quizzes * 0.20 +
            self.projects * 0.20
        )
        return self.final_grade
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'studentId': self.student_id,
            'subject': self.subject,
            'midterm': self.midterm,
            'finals': self.finals,
            'quizzes': self.quizzes,
            'projects': self.projects,
            'finalGrade': self.final_grade
        }
    
    def __repr__(self):
        return f'<Grade {self.student_id} - {self.subject}>'


class AttendanceDB(db.Model):
    """MySQL table for attendance"""
    __tablename__ = 'attendance'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.String(50), db.ForeignKey('students.student_id'), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), nullable=False)  # 'present' or 'absent'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'studentId': self.student_id,
            'date': self.date,
            'status': self.status
        }
    
    def __repr__(self):
        return f'<Attendance {self.student_id} - {self.date}>'


def init_db(app):
    """Initialize database"""
    db.init_app(app)
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
