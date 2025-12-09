"""
Analytics Module using NumPy
Provides statistical analysis of student grades and attendance
"""

import numpy as np
from typing import List, Dict, Optional
from database import StudentDB, GradeDB, AttendanceDB


def calculate_mean(grades: List[float]) -> float:
    """Calculate mean (average) of grades"""
    if not grades:
        return 0.0
    return float(np.mean(grades))


def calculate_median(grades: List[float]) -> float:
    """Calculate median of grades"""
    if not grades:
        return 0.0
    return float(np.median(grades))


def calculate_mode(grades: List[float]) -> float:
    """Calculate mode (most frequent) of grades"""
    if not grades:
        return 0.0
    
    # Round grades to nearest integer for mode calculation
    rounded_grades = np.round(grades).astype(int)
    values, counts = np.unique(rounded_grades, return_counts=True)
    
    if len(values) == 0:
        return 0.0
    
    mode_index = np.argmax(counts)
    return float(values[mode_index])


def calculate_std_deviation(grades: List[float]) -> float:
    """Calculate standard deviation of grades"""
    if not grades or len(grades) < 2:
        return 0.0
    return float(np.std(grades, ddof=1))  # Sample std deviation


def calculate_variance(grades: List[float]) -> float:
    """Calculate variance of grades"""
    if not grades or len(grades) < 2:
        return 0.0
    return float(np.var(grades, ddof=1))


def get_min_max(grades: List[float]) -> Dict[str, float]:
    """Get minimum and maximum grades"""
    if not grades:
        return {'min': 0.0, 'max': 0.0}
    
    return {
        'min': float(np.min(grades)),
        'max': float(np.max(grades))
    }


def calculate_attendance_percentage(student_id: str) -> float:
    """Calculate attendance percentage for a student"""
    records = AttendanceDB.query.filter_by(student_id=student_id).all()
    
    if not records:
        return 0.0
    
    present_count = sum(1 for record in records if record.status == 'present')
    total_count = len(records)
    
    return (present_count / total_count) * 100


def get_student_analytics(student_id: str) -> Dict:
    """Get comprehensive analytics for a specific student"""
    # Fetch grades
    grade_records = GradeDB.query.filter_by(student_id=student_id).all()
    
    if not grade_records:
        return {
            'student_id': student_id,
            'error': 'No grades found for this student'
        }
    
    # Extract final grades
    final_grades = [g.final_grade for g in grade_records if g.final_grade is not None]
    
    if not final_grades:
        # Calculate final grades if not already done
        final_grades = []
        for grade in grade_records:
            if grade.final_grade is None:
                grade.calculate_final_grade()
            final_grades.append(grade.final_grade)
    
    # Calculate statistics
    min_max = get_min_max(final_grades)
    attendance_pct = calculate_attendance_percentage(student_id)
    
    analytics = {
        'student_id': student_id,
        'total_subjects': len(grade_records),
        'mean': round(calculate_mean(final_grades), 2),
        'median': round(calculate_median(final_grades), 2),
        'mode': round(calculate_mode(final_grades), 2),
        'std_deviation': round(calculate_std_deviation(final_grades), 2),
        'variance': round(calculate_variance(final_grades), 2),
        'min_grade': round(min_max['min'], 2),
        'max_grade': round(min_max['max'], 2),
        'attendance_percentage': round(attendance_pct, 2),
        'gpa': round(calculate_mean(final_grades) / 25, 2)  # Assuming 100-point scale to 4.0
    }
    
    return analytics


def get_class_analytics() -> Dict:
    """Get analytics for entire class"""
    # Fetch all grades
    all_grades = GradeDB.query.all()
    
    if not all_grades:
        return {
            'error': 'No grades found in database'
        }
    
    # Calculate final grades for all
    final_grades = []
    for grade in all_grades:
        if grade.final_grade is None:
            grade.calculate_final_grade()
        final_grades.append(grade.final_grade)
    
    # Calculate overall attendance
    all_attendance = AttendanceDB.query.all()
    present_count = sum(1 for record in all_attendance if record.status == 'present')
    total_attendance_records = len(all_attendance)
    overall_attendance = (present_count / total_attendance_records * 100) if total_attendance_records > 0 else 0.0
    
    # Get statistics
    min_max = get_min_max(final_grades)
    
    analytics = {
        'total_students': StudentDB.query.count(),
        'total_grade_records': len(all_grades),
        'total_attendance_records': total_attendance_records,
        'mean': round(calculate_mean(final_grades), 2),
        'median': round(calculate_median(final_grades), 2),
        'mode': round(calculate_mode(final_grades), 2),
        'std_deviation': round(calculate_std_deviation(final_grades), 2),
        'variance': round(calculate_variance(final_grades), 2),
        'min_grade': round(min_max['min'], 2),
        'max_grade': round(min_max['max'], 2),
        'overall_attendance_percentage': round(overall_attendance, 2)
    }
    
    return analytics


def get_grade_distribution() -> Dict:
    """Get grade distribution for visualization"""
    all_grades = GradeDB.query.all()
    
    if not all_grades:
        return {'error': 'No grades found'}
    
    # Calculate final grades
    final_grades = []
    for grade in all_grades:
        if grade.final_grade is None:
            grade.calculate_final_grade()
        final_grades.append(grade.final_grade)
    
    # Create distribution bins (A, B, C, D, F)
    grades_array = np.array(final_grades)
    
    distribution = {
        'A (90-100)': int(np.sum((grades_array >= 90) & (grades_array <= 100))),
        'B (80-89)': int(np.sum((grades_array >= 80) & (grades_array < 90))),
        'C (70-79)': int(np.sum((grades_array >= 70) & (grades_array < 80))),
        'D (60-69)': int(np.sum((grades_array >= 60) & (grades_array < 70))),
        'F (<60)': int(np.sum(grades_array < 60))
    }
    
    return distribution


def get_subject_analytics(subject: str) -> Dict:
    """Get analytics for a specific subject"""
    grades = GradeDB.query.filter_by(subject=subject).all()
    
    if not grades:
        return {
            'subject': subject,
            'error': 'No grades found for this subject'
        }
    
    final_grades = []
    for grade in grades:
        if grade.final_grade is None:
            grade.calculate_final_grade()
        final_grades.append(grade.final_grade)
    
    min_max = get_min_max(final_grades)
    
    return {
        'subject': subject,
        'total_students': len(grades),
        'mean': round(calculate_mean(final_grades), 2),
        'median': round(calculate_median(final_grades), 2),
        'mode': round(calculate_mode(final_grades), 2),
        'std_deviation': round(calculate_std_deviation(final_grades), 2),
        'min_grade': round(min_max['min'], 2),
        'max_grade': round(min_max['max'], 2)
    }
