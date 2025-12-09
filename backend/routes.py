"""
Flask REST API Routes
All API endpoints for the Student Management System
"""

from flask import Blueprint, request, jsonify
from database import db, StudentDB, GradeDB, AttendanceDB
from models import Student, HonorsStudent, ClassList, display_student_info
from analytics import (
    get_student_analytics, get_class_analytics, 
    get_grade_distribution, get_subject_analytics
)
from predictions import (
    predict_student_grade, predict_all_students_grades,
    linear_regression_predict
)
from visualizations import (
    generate_grade_distribution_pie_chart,
    generate_grade_progress_line_chart,
    generate_attendance_bar_chart,
    generate_subject_comparison_chart,
    generate_class_performance_chart
)
from json_utils import export_to_json, import_from_json, clear_all_data

# Create Blueprint
api = Blueprint('api', __name__)


# ============= STUDENT ROUTES =============

@api.route('/students', methods=['GET'])
def get_students():
    """Get all students"""
    try:
        students = StudentDB.query.all()
        return jsonify({
            'success': True,
            'students': [student.to_dict() for student in students],
            'count': len(students)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/students/<student_id>', methods=['GET'])
def get_student(student_id):
    """Get specific student details"""
    try:
        student = StudentDB.query.filter_by(student_id=student_id).first()
        
        if not student:
            return jsonify({'success': False, 'error': 'Student not found'}), 404
        
        # Get associated data
        grades = GradeDB.query.filter_by(student_id=student_id).all()
        attendance = AttendanceDB.query.filter_by(student_id=student_id).all()
        
        return jsonify({
            'success': True,
            'student': student.to_dict(),
            'grades': [grade.to_dict() for grade in grades],
            'attendance': [record.to_dict() for record in attendance]
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/students', methods=['POST'])
def add_student():
    """Add a new student"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ['id', 'name', 'email', 'course', 'enrollmentDate']
        if not all(field in data for field in required):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Check if student already exists
        existing = StudentDB.query.filter_by(student_id=data['id']).first()
        if existing:
            return jsonify({'success': False, 'error': 'Student ID already exists'}), 400
        
        # Create student
        student = StudentDB(
            student_id=data['id'],
            name=data['name'],
            email=data['email'],
            age=data.get('age'),
            course=data['course'],
            enrollment_date=data['enrollmentDate'],
            student_type=data.get('studentType', 'Regular'),
            scholarship=data.get('scholarship')
        )
        
        db.session.add(student)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Student added successfully',
            'student': student.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    """Update student information"""
    try:
        student = StudentDB.query.filter_by(student_id=student_id).first()
        
        if not student:
            return jsonify({'success': False, 'error': 'Student not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            student.name = data['name']
        if 'email' in data:
            student.email = data['email']
        if 'age' in data:
            student.age = data['age']
        if 'course' in data:
            student.course = data['course']
        if 'enrollmentDate' in data:
            student.enrollment_date = data['enrollmentDate']
        if 'studentType' in data:
            student.student_type = data['studentType']
        if 'scholarship' in data:
            student.scholarship = data['scholarship']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Student updated successfully',
            'student': student.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Delete a student"""
    try:
        student = StudentDB.query.filter_by(student_id=student_id).first()
        
        if not student:
            return jsonify({'success': False, 'error': 'Student not found'}), 404
        
        db.session.delete(student)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Student deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


# ============= GRADE ROUTES =============

@api.route('/grades', methods=['GET'])
def get_grades():
    """Get all grades"""
    try:
        student_id = request.args.get('studentId')
        
        if student_id:
            grades = GradeDB.query.filter_by(student_id=student_id).all()
        else:
            grades = GradeDB.query.all()
        
        return jsonify({
            'success': True,
            'grades': [grade.to_dict() for grade in grades],
            'count': len(grades)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/grades', methods=['POST'])
def add_grade():
    """Add a new grade"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ['studentId', 'subject']
        if not all(field in data for field in required):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Verify student exists
        student = StudentDB.query.filter_by(student_id=data['studentId']).first()
        if not student:
            return jsonify({'success': False, 'error': 'Student not found'}), 404
        
        # Create grade
        grade = GradeDB(
            student_id=data['studentId'],
            subject=data['subject'],
            midterm=data.get('midterm', 0.0),
            finals=data.get('finals', 0.0),
            quizzes=data.get('quizzes', 0.0),
            projects=data.get('projects', 0.0)
        )
        
        # Calculate final grade
        grade.calculate_final_grade()
        
        db.session.add(grade)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Grade added successfully',
            'grade': grade.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/grades/<int:grade_id>', methods=['PUT'])
def update_grade(grade_id):
    """Update a grade"""
    try:
        grade = GradeDB.query.filter_by(id=grade_id).first()
        
        if not grade:
            return jsonify({'success': False, 'error': 'Grade not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'subject' in data:
            grade.subject = data['subject']
        if 'midterm' in data:
            grade.midterm = data['midterm']
        if 'finals' in data:
            grade.finals = data['finals']
        if 'quizzes' in data:
            grade.quizzes = data['quizzes']
        if 'projects' in data:
            grade.projects = data['projects']
        
        # Recalculate final grade
        grade.calculate_final_grade()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Grade updated successfully',
            'grade': grade.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/grades/<int:grade_id>', methods=['DELETE'])
def delete_grade(grade_id):
    """Delete a grade"""
    try:
        grade = GradeDB.query.filter_by(id=grade_id).first()
        
        if not grade:
            return jsonify({'success': False, 'error': 'Grade not found'}), 404
        
        db.session.delete(grade)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Grade deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


# ============= ATTENDANCE ROUTES =============

@api.route('/attendance', methods=['GET'])
def get_attendance():
    """Get attendance records"""
    try:
        student_id = request.args.get('studentId')
        
        if student_id:
            records = AttendanceDB.query.filter_by(student_id=student_id).all()
        else:
            records = AttendanceDB.query.all()
        
        return jsonify({
            'success': True,
            'attendance': [record.to_dict() for record in records],
            'count': len(records)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/attendance', methods=['POST'])
def add_attendance():
    """Add attendance record"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ['studentId', 'date', 'status']
        if not all(field in data for field in required):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Verify student exists
        student = StudentDB.query.filter_by(student_id=data['studentId']).first()
        if not student:
            return jsonify({'success': False, 'error': 'Student not found'}), 404
        
        # Validate status
        if data['status'] not in ['present', 'absent']:
            return jsonify({'success': False, 'error': 'Invalid status'}), 400
        
        # Create attendance record
        attendance = AttendanceDB(
            student_id=data['studentId'],
            date=data['date'],
            status=data['status']
        )
        
        db.session.add(attendance)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Attendance recorded successfully',
            'attendance': attendance.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/attendance/<int:attendance_id>', methods=['DELETE'])
def delete_attendance(attendance_id):
    """Delete attendance record"""
    try:
        attendance = AttendanceDB.query.filter_by(id=attendance_id).first()
        
        if not attendance:
            return jsonify({'success': False, 'error': 'Attendance record not found'}), 404
        
        db.session.delete(attendance)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Attendance record deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


# ============= ANALYTICS ROUTES =============

@api.route('/analytics/student/<student_id>', methods=['GET'])
def get_student_stats(student_id):
    """Get analytics for specific student"""
    try:
        analytics = get_student_analytics(student_id)
        return jsonify({
            'success': True,
            'analytics': analytics
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/analytics/class', methods=['GET'])
def get_class_stats():
    """Get analytics for entire class"""
    try:
        analytics = get_class_analytics()
        return jsonify({
            'success': True,
            'analytics': analytics
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/analytics/distribution', methods=['GET'])
def get_distribution():
    """Get grade distribution"""
    try:
        distribution = get_grade_distribution()
        return jsonify({
            'success': True,
            'distribution': distribution
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/analytics/subject/<subject>', methods=['GET'])
def get_subject_stats(subject):
    """Get analytics for specific subject"""
    try:
        analytics = get_subject_analytics(subject)
        return jsonify({
            'success': True,
            'analytics': analytics
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============= PREDICTION ROUTES =============

@api.route('/predictions/student/<student_id>', methods=['GET'])
def predict_student(student_id):
    """Predict student's next grade"""
    try:
        subject = request.args.get('subject')
        
        if not subject:
            return jsonify({'success': False, 'error': 'Subject parameter required'}), 400
        
        prediction = predict_student_grade(student_id, subject)
        
        return jsonify({
            'success': True,
            'prediction': prediction
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/predictions/all', methods=['GET'])
def predict_all():
    """Predict grades for all students"""
    try:
        subject = request.args.get('subject')
        predictions = predict_all_students_grades(subject)
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'count': len(predictions)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/predictions/custom', methods=['POST'])
def predict_custom():
    """Custom prediction with provided grades"""
    try:
        data = request.get_json()
        
        if 'grades' not in data or not isinstance(data['grades'], list):
            return jsonify({'success': False, 'error': 'Grades array required'}), 400
        
        prediction = linear_regression_predict(data['grades'])
        
        return jsonify({
            'success': True,
            'prediction': prediction
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============= VISUALIZATION ROUTES =============

@api.route('/charts/grade-distribution', methods=['GET'])
def chart_grade_distribution():
    """Get grade distribution pie chart"""
    try:
        student_id = request.args.get('studentId')
        chart = generate_grade_distribution_pie_chart(student_id)
        
        return jsonify({
            'success': True,
            'chart': chart
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/charts/grade-progress/<student_id>', methods=['GET'])
def chart_grade_progress(student_id):
    """Get grade progress line chart"""
    try:
        subject = request.args.get('subject')
        chart = generate_grade_progress_line_chart(student_id, subject)
        
        return jsonify({
            'success': True,
            'chart': chart
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/charts/attendance', methods=['GET'])
def chart_attendance():
    """Get attendance bar chart"""
    try:
        student_id = request.args.get('studentId')
        chart = generate_attendance_bar_chart(student_id)
        
        return jsonify({
            'success': True,
            'chart': chart
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/charts/subject-comparison/<student_id>', methods=['GET'])
def chart_subject_comparison(student_id):
    """Get subject comparison chart"""
    try:
        chart = generate_subject_comparison_chart(student_id)
        
        return jsonify({
            'success': True,
            'chart': chart
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/charts/class-performance', methods=['GET'])
def chart_class_performance():
    """Get class performance chart"""
    try:
        chart = generate_class_performance_chart()
        
        return jsonify({
            'success': True,
            'chart': chart
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============= DATA PERSISTENCE ROUTES =============

@api.route('/data/export', methods=['GET'])
def export_data():
    """Export all data to JSON"""
    try:
        data = export_to_json()
        
        return jsonify({
            'success': True,
            'data': data
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/data/import', methods=['POST'])
def import_data():
    """Import data from JSON"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        stats = import_from_json(data=data)
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/data/clear', methods=['DELETE'])
def clear_data():
    """Clear all data (use with caution!)"""
    try:
        result = clear_all_data()
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============= OOP DEMONSTRATION ROUTES =============

@api.route('/oop/demo', methods=['GET'])
def oop_demo():
    """Demonstrate OOP concepts"""
    try:
        # Create instances
        regular_student = Student(
            person_id='S001',
            name='John Doe',
            email='john@example.com',
            course='Computer Science',
            enrollment_date='2024-01-01',
            age=20
        )
        
        honors_student = HonorsStudent(
            person_id='H001',
            name='Jane Smith',
            email='jane@example.com',
            course='Mathematics',
            enrollment_date='2024-01-01',
            scholarship='Merit Scholarship',
            age=21
        )
        
        # Demonstrate polymorphism
        students = [regular_student, honors_student]
        
        # Demonstrate ClassList iterator
        class_list = ClassList(students)
        
        student_infos = []
        for student in class_list:  # Using iterator
            info = display_student_info(student)  # Polymorphism
            student_infos.append(info)
        
        return jsonify({
            'success': True,
            'message': 'OOP Demonstration',
            'concepts': {
                'inheritance': 'Student and HonorsStudent inherit from Person',
                'polymorphism': 'get_info() method behaves differently for each class',
                'iterator': 'ClassList implements __iter__ and __next__ for iteration'
            },
            'students': student_infos
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============= HEALTH CHECK =============

@api.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'API is running',
        'version': '1.0.0'
    }), 200
