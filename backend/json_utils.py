"""
JSON Import/Export Utilities
Provides functions to backup and restore data in JSON format
"""

import json
from datetime import datetime
from typing import Dict, List
from database import db, StudentDB, GradeDB, AttendanceDB


def export_to_json(filepath: str = None) -> Dict:
    """
    Export all database data to JSON format
    
    Args:
        filepath: Optional file path to save JSON. If None, returns dict only.
    
    Returns:
        Dictionary containing all students, grades, and attendance
    """
    # Fetch all data
    students = StudentDB.query.all()
    grades = GradeDB.query.all()
    attendance = AttendanceDB.query.all()
    
    # Convert to dictionaries
    data = {
        'students': [student.to_dict() for student in students],
        'grades': [grade.to_dict() for grade in grades],
        'attendance': [record.to_dict() for record in attendance],
        'export_date': datetime.utcnow().isoformat(),
        'record_counts': {
            'students': len(students),
            'grades': len(grades),
            'attendance': len(attendance)
        }
    }
    
    # Save to file if filepath provided
    if filepath:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data exported to {filepath}")
    
    return data


def import_from_json(filepath: str = None, data: Dict = None) -> Dict:
    """
    Import data from JSON and populate MySQL database
    
    Args:
        filepath: Path to JSON file to import
        data: Dictionary data to import (alternative to filepath)
    
    Returns:
        Dictionary with import statistics
    """
    # Load data from file or use provided dict
    if filepath:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    
    if not data:
        raise ValueError("No data provided for import")
    
    stats = {
        'students_imported': 0,
        'grades_imported': 0,
        'attendance_imported': 0,
        'errors': []
    }
    
    try:
        # Import students
        for student_data in data.get('students', []):
            try:
                # Check if student exists
                existing = StudentDB.query.filter_by(student_id=student_data['id']).first()
                
                if existing:
                    # Update existing student
                    existing.name = student_data['name']
                    existing.email = student_data['email']
                    existing.age = student_data.get('age')
                    existing.course = student_data['course']
                    existing.enrollment_date = student_data['enrollmentDate']
                    existing.student_type = student_data.get('studentType', 'Regular')
                    existing.scholarship = student_data.get('scholarship')
                else:
                    # Create new student
                    student = StudentDB(
                        student_id=student_data['id'],
                        name=student_data['name'],
                        email=student_data['email'],
                        age=student_data.get('age'),
                        course=student_data['course'],
                        enrollment_date=student_data['enrollmentDate'],
                        student_type=student_data.get('studentType', 'Regular'),
                        scholarship=student_data.get('scholarship')
                    )
                    db.session.add(student)
                
                stats['students_imported'] += 1
            except Exception as e:
                stats['errors'].append(f"Student {student_data.get('id')}: {str(e)}")
        
        db.session.commit()
        
        # Import grades
        for grade_data in data.get('grades', []):
            try:
                # Check if grade record exists
                existing = GradeDB.query.filter_by(
                    id=grade_data.get('id')
                ).first() if grade_data.get('id') else None
                
                if existing:
                    # Update existing grade
                    existing.subject = grade_data['subject']
                    existing.midterm = grade_data.get('midterm', 0.0)
                    existing.finals = grade_data.get('finals', 0.0)
                    existing.quizzes = grade_data.get('quizzes', 0.0)
                    existing.projects = grade_data.get('projects', 0.0)
                    existing.final_grade = grade_data.get('finalGrade')
                else:
                    # Create new grade
                    grade = GradeDB(
                        student_id=grade_data['studentId'],
                        subject=grade_data['subject'],
                        midterm=grade_data.get('midterm', 0.0),
                        finals=grade_data.get('finals', 0.0),
                        quizzes=grade_data.get('quizzes', 0.0),
                        projects=grade_data.get('projects', 0.0),
                        final_grade=grade_data.get('finalGrade')
                    )
                    db.session.add(grade)
                
                stats['grades_imported'] += 1
            except Exception as e:
                stats['errors'].append(f"Grade {grade_data.get('id')}: {str(e)}")
        
        db.session.commit()
        
        # Import attendance
        for attendance_data in data.get('attendance', []):
            try:
                # Check if attendance record exists
                existing = AttendanceDB.query.filter_by(
                    id=attendance_data.get('id')
                ).first() if attendance_data.get('id') else None
                
                if existing:
                    # Update existing attendance
                    existing.date = attendance_data['date']
                    existing.status = attendance_data['status']
                else:
                    # Create new attendance record
                    attendance = AttendanceDB(
                        student_id=attendance_data['studentId'],
                        date=attendance_data['date'],
                        status=attendance_data['status']
                    )
                    db.session.add(attendance)
                
                stats['attendance_imported'] += 1
            except Exception as e:
                stats['errors'].append(f"Attendance {attendance_data.get('id')}: {str(e)}")
        
        db.session.commit()
        
    except Exception as e:
        db.session.rollback()
        stats['errors'].append(f"Import failed: {str(e)}")
    
    return stats


def clear_all_data():
    """Clear all data from database (use with caution!)"""
    try:
        AttendanceDB.query.delete()
        GradeDB.query.delete()
        StudentDB.query.delete()
        db.session.commit()
        return {'success': True, 'message': 'All data cleared'}
    except Exception as e:
        db.session.rollback()
        return {'success': False, 'message': str(e)}
