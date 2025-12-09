"""
Database Initialization Script
Creates sample data for testing
"""

from app import create_app
from database import db, StudentDB, GradeDB, AttendanceDB
from datetime import datetime, timedelta
import random

def create_sample_data():
    """Create sample students, grades, and attendance records"""
    
    app = create_app()
    
    with app.app_context():
        print("Creating sample data...\n")
        
        # Sample students
        students_data = [
            {
                'student_id': 'S001',
                'name': 'Alice Johnson',
                'email': 'alice@example.com',
                'age': 20,
                'course': 'Computer Science',
                'enrollment_date': '2024-01-15',
                'student_type': 'Honors',
                'scholarship': 'Merit Scholarship'
            },
            {
                'student_id': 'S002',
                'name': 'Bob Smith',
                'email': 'bob@example.com',
                'age': 21,
                'course': 'Mathematics',
                'enrollment_date': '2024-01-15',
                'student_type': 'Regular',
                'scholarship': None
            },
            {
                'student_id': 'S003',
                'name': 'Carol Williams',
                'email': 'carol@example.com',
                'age': 19,
                'course': 'Physics',
                'enrollment_date': '2024-01-16',
                'student_type': 'Regular',
                'scholarship': None
            },
            {
                'student_id': 'S004',
                'name': 'David Brown',
                'email': 'david@example.com',
                'age': 22,
                'course': 'Engineering',
                'enrollment_date': '2024-01-16',
                'student_type': 'Honors',
                'scholarship': 'Dean\'s List'
            },
            {
                'student_id': 'S005',
                'name': 'Emma Davis',
                'email': 'emma@example.com',
                'age': 20,
                'course': 'Biology',
                'enrollment_date': '2024-01-17',
                'student_type': 'Regular',
                'scholarship': None
            }
        ]
        
        # Add students
        for student_data in students_data:
            existing = StudentDB.query.filter_by(student_id=student_data['student_id']).first()
            if not existing:
                student = StudentDB(**student_data)
                db.session.add(student)
                print(f"✓ Added student: {student_data['name']}")
        
        db.session.commit()
        
        # Sample subjects
        subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English']
        
        # Add grades for each student
        for student_data in students_data:
            student_id = student_data['student_id']
            
            # Add 3-5 subjects per student
            num_subjects = random.randint(3, 5)
            student_subjects = random.sample(subjects, num_subjects)
            
            for subject in student_subjects:
                # Check if grade already exists
                existing = GradeDB.query.filter_by(
                    student_id=student_id,
                    subject=subject
                ).first()
                
                if not existing:
                    # Generate realistic grades
                    base_grade = random.randint(70, 95)
                    grade = GradeDB(
                        student_id=student_id,
                        subject=subject,
                        midterm=base_grade + random.randint(-5, 5),
                        finals=base_grade + random.randint(-5, 5),
                        quizzes=base_grade + random.randint(-10, 10),
                        projects=base_grade + random.randint(-5, 10)
                    )
                    grade.calculate_final_grade()
                    db.session.add(grade)
                    print(f"✓ Added grade: {student_data['name']} - {subject}")
        
        db.session.commit()
        
        # Add attendance records for last 30 days
        base_date = datetime.now() - timedelta(days=30)
        
        for student_data in students_data:
            student_id = student_data['student_id']
            
            for i in range(30):
                date = (base_date + timedelta(days=i)).strftime('%Y-%m-%d')
                
                # Check if record exists
                existing = AttendanceDB.query.filter_by(
                    student_id=student_id,
                    date=date
                ).first()
                
                if not existing:
                    # 85% chance of being present
                    status = 'present' if random.random() < 0.85 else 'absent'
                    
                    attendance = AttendanceDB(
                        student_id=student_id,
                        date=date,
                        status=status
                    )
                    db.session.add(attendance)
            
            print(f"✓ Added attendance records: {student_data['name']}")
        
        db.session.commit()
        
        print("\n" + "="*60)
        print("✅ Sample data created successfully!")
        print("="*60)
        print(f"Students: {StudentDB.query.count()}")
        print(f"Grades: {GradeDB.query.count()}")
        print(f"Attendance Records: {AttendanceDB.query.count()}")
        print("="*60)

if __name__ == '__main__':
    create_sample_data()
