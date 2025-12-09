"""
Quick script to view all students in the database
"""
from database import db, StudentDB
from app import create_app

app = create_app()

with app.app_context():
    students = StudentDB.query.all()
    
    print(f'\n{"="*80}')
    print(f'STUDENTS IN DATABASE (Total: {len(students)})')
    print(f'{"="*80}\n')
    
    if students:
        for s in students:
            print(f'ID: {s.student_id}')
            print(f'Name: {s.name}')
            print(f'Email: {s.email}')
            print(f'Age: {s.age}')
            print(f'Course: {s.course}')
            print(f'Type: {s.student_type}')
            print(f'Enrollment Date: {s.enrollment_date}')
            print('-' * 80)
    else:
        print('No students found in database.')
    
    print()
