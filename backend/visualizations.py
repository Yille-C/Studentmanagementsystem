"""
Data Visualization Module using Matplotlib
Generates charts and returns them as base64-encoded images
"""

import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import numpy as np
import io
import base64
from typing import List, Dict, Optional
from database import StudentDB, GradeDB, AttendanceDB


def fig_to_base64(fig) -> str:
    """Convert matplotlib figure to base64 string"""
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close(fig)
    return f"data:image/png;base64,{img_base64}"


def generate_grade_distribution_pie_chart(student_id: str = None) -> str:
    """
    Generate pie chart showing grade distribution (A, B, C, D, F)
    
    Args:
        student_id: Optional student ID. If None, shows distribution for all students.
    
    Returns:
        Base64-encoded PNG image
    """
    # Fetch grades
    if student_id:
        grades = GradeDB.query.filter_by(student_id=student_id).all()
        title = f'Grade Distribution for Student {student_id}'
    else:
        grades = GradeDB.query.all()
        title = 'Overall Grade Distribution'
    
    if not grades:
        # Return empty chart
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.text(0.5, 0.5, 'No Data Available', ha='center', va='center', fontsize=16)
        ax.axis('off')
        return fig_to_base64(fig)
    
    # Calculate final grades
    final_grades = []
    for grade in grades:
        if grade.final_grade is None:
            grade.calculate_final_grade()
        final_grades.append(grade.final_grade)
    
    grades_array = np.array(final_grades)
    
    # Create distribution
    distribution = {
        'A (90-100)': int(np.sum((grades_array >= 90) & (grades_array <= 100))),
        'B (80-89)': int(np.sum((grades_array >= 80) & (grades_array < 90))),
        'C (70-79)': int(np.sum((grades_array >= 70) & (grades_array < 80))),
        'D (60-69)': int(np.sum((grades_array >= 60) & (grades_array < 70))),
        'F (<60)': int(np.sum(grades_array < 60))
    }
    
    # Remove zero values
    labels = [k for k, v in distribution.items() if v > 0]
    sizes = [v for v in distribution.values() if v > 0]
    colors = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'][:len(labels)]
    
    # Create pie chart
    fig, ax = plt.subplots(figsize=(10, 8))
    wedges, texts, autotexts = ax.pie(
        sizes, 
        labels=labels, 
        autopct='%1.1f%%',
        colors=colors,
        startangle=90,
        textprops={'fontsize': 11, 'weight': 'bold'}
    )
    
    ax.set_title(title, fontsize=14, weight='bold', pad=20)
    
    # Equal aspect ratio ensures circular pie
    ax.axis('equal')
    
    return fig_to_base64(fig)


def generate_grade_progress_line_chart(student_id: str, subject: str = None) -> str:
    """
    Generate line chart showing grade progress over time
    
    Args:
        student_id: Student ID
        subject: Optional subject filter
    
    Returns:
        Base64-encoded PNG image
    """
    # Fetch grades
    query = GradeDB.query.filter_by(student_id=student_id)
    if subject:
        query = query.filter_by(subject=subject)
    
    grades = query.order_by(GradeDB.created_at).all()
    
    if not grades:
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.text(0.5, 0.5, 'No Grade Data Available', ha='center', va='center', fontsize=16)
        ax.axis('off')
        return fig_to_base64(fig)
    
    # Prepare data
    subjects = [g.subject for g in grades]
    final_grades = []
    for grade in grades:
        if grade.final_grade is None:
            grade.calculate_final_grade()
        final_grades.append(grade.final_grade)
    
    x_labels = [f"{s[:10]}..." if len(s) > 10 else s for s in subjects]
    x = np.arange(len(final_grades))
    
    # Create line chart
    fig, ax = plt.subplots(figsize=(12, 7))
    
    # Plot line
    ax.plot(x, final_grades, marker='o', linewidth=2, markersize=8, color='#2196F3', label='Final Grade')
    
    # Add horizontal lines for grade boundaries
    ax.axhline(y=90, color='#4CAF50', linestyle='--', alpha=0.5, linewidth=1, label='A Grade (90)')
    ax.axhline(y=80, color='#8BC34A', linestyle='--', alpha=0.5, linewidth=1, label='B Grade (80)')
    ax.axhline(y=70, color='#FFC107', linestyle='--', alpha=0.5, linewidth=1, label='C Grade (70)')
    ax.axhline(y=60, color='#FF9800', linestyle='--', alpha=0.5, linewidth=1, label='D Grade (60)')
    
    # Customize
    ax.set_xlabel('Subject / Time Period', fontsize=12, weight='bold')
    ax.set_ylabel('Grade', fontsize=12, weight='bold')
    ax.set_title(f'Grade Progress for Student {student_id}', fontsize=14, weight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(x_labels, rotation=45, ha='right')
    ax.set_ylim(0, 105)
    ax.grid(True, alpha=0.3, linestyle=':', linewidth=0.5)
    ax.legend(loc='best', fontsize=9)
    
    plt.tight_layout()
    
    return fig_to_base64(fig)


def generate_attendance_bar_chart(student_id: str = None) -> str:
    """
    Generate bar chart showing attendance statistics
    
    Args:
        student_id: Optional student ID. If None, shows attendance for all students.
    
    Returns:
        Base64-encoded PNG image
    """
    if student_id:
        # Single student attendance
        records = AttendanceDB.query.filter_by(student_id=student_id).all()
        
        if not records:
            fig, ax = plt.subplots(figsize=(10, 6))
            ax.text(0.5, 0.5, 'No Attendance Data Available', ha='center', va='center', fontsize=16)
            ax.axis('off')
            return fig_to_base64(fig)
        
        present = sum(1 for r in records if r.status == 'present')
        absent = sum(1 for r in records if r.status == 'absent')
        
        labels = ['Present', 'Absent']
        values = [present, absent]
        colors = ['#4CAF50', '#F44336']
        
        fig, ax = plt.subplots(figsize=(8, 6))
        bars = ax.bar(labels, values, color=colors, alpha=0.8, edgecolor='black', linewidth=1.5)
        
        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{int(height)}',
                   ha='center', va='bottom', fontsize=12, weight='bold')
        
        ax.set_ylabel('Number of Days', fontsize=12, weight='bold')
        ax.set_title(f'Attendance Record for Student {student_id}', fontsize=14, weight='bold', pad=20)
        ax.set_ylim(0, max(values) * 1.15)
        ax.grid(True, axis='y', alpha=0.3, linestyle=':', linewidth=0.5)
        
    else:
        # All students attendance comparison
        students = StudentDB.query.all()
        
        if not students:
            fig, ax = plt.subplots(figsize=(10, 6))
            ax.text(0.5, 0.5, 'No Student Data Available', ha='center', va='center', fontsize=16)
            ax.axis('off')
            return fig_to_base64(fig)
        
        student_names = []
        attendance_percentages = []
        
        for student in students[:15]:  # Limit to 15 students for readability
            records = AttendanceDB.query.filter_by(student_id=student.student_id).all()
            if records:
                present = sum(1 for r in records if r.status == 'present')
                percentage = (present / len(records)) * 100
                student_names.append(student.name[:15])  # Truncate long names
                attendance_percentages.append(percentage)
        
        if not attendance_percentages:
            fig, ax = plt.subplots(figsize=(10, 6))
            ax.text(0.5, 0.5, 'No Attendance Data Available', ha='center', va='center', fontsize=16)
            ax.axis('off')
            return fig_to_base64(fig)
        
        x = np.arange(len(student_names))
        colors = ['#4CAF50' if p >= 80 else '#FFC107' if p >= 60 else '#F44336' for p in attendance_percentages]
        
        fig, ax = plt.subplots(figsize=(14, 7))
        bars = ax.bar(x, attendance_percentages, color=colors, alpha=0.8, edgecolor='black', linewidth=1.5)
        
        # Add value labels
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{height:.1f}%',
                   ha='center', va='bottom', fontsize=9, weight='bold')
        
        ax.set_xlabel('Students', fontsize=12, weight='bold')
        ax.set_ylabel('Attendance Percentage (%)', fontsize=12, weight='bold')
        ax.set_title('Student Attendance Comparison', fontsize=14, weight='bold', pad=20)
        ax.set_xticks(x)
        ax.set_xticklabels(student_names, rotation=45, ha='right')
        ax.set_ylim(0, 105)
        ax.grid(True, axis='y', alpha=0.3, linestyle=':', linewidth=0.5)
        
        # Add reference line at 80%
        ax.axhline(y=80, color='red', linestyle='--', alpha=0.5, linewidth=1, label='Target (80%)')
        ax.legend(loc='best')
    
    plt.tight_layout()
    
    return fig_to_base64(fig)


def generate_subject_comparison_chart(student_id: str) -> str:
    """
    Generate bar chart comparing grades across subjects for a student
    
    Args:
        student_id: Student ID
    
    Returns:
        Base64-encoded PNG image
    """
    grades = GradeDB.query.filter_by(student_id=student_id).all()
    
    if not grades:
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.text(0.5, 0.5, 'No Grade Data Available', ha='center', va='center', fontsize=16)
        ax.axis('off')
        return fig_to_base64(fig)
    
    subjects = []
    midterms = []
    finals = []
    quizzes = []
    projects = []
    final_grades = []
    
    for grade in grades:
        if grade.final_grade is None:
            grade.calculate_final_grade()
        
        subjects.append(grade.subject[:15])  # Truncate long names
        midterms.append(grade.midterm)
        finals.append(grade.finals)
        quizzes.append(grade.quizzes)
        projects.append(grade.projects)
        final_grades.append(grade.final_grade)
    
    x = np.arange(len(subjects))
    width = 0.15
    
    fig, ax = plt.subplots(figsize=(14, 7))
    
    ax.bar(x - 2*width, midterms, width, label='Midterm', color='#2196F3', alpha=0.8)
    ax.bar(x - width, finals, width, label='Finals', color='#4CAF50', alpha=0.8)
    ax.bar(x, quizzes, width, label='Quizzes', color='#FFC107', alpha=0.8)
    ax.bar(x + width, projects, width, label='Projects', color='#9C27B0', alpha=0.8)
    ax.bar(x + 2*width, final_grades, width, label='Final Grade', color='#F44336', alpha=0.8)
    
    ax.set_xlabel('Subjects', fontsize=12, weight='bold')
    ax.set_ylabel('Grades', fontsize=12, weight='bold')
    ax.set_title(f'Subject Comparison for Student {student_id}', fontsize=14, weight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(subjects, rotation=45, ha='right')
    ax.set_ylim(0, 105)
    ax.legend(loc='best')
    ax.grid(True, axis='y', alpha=0.3, linestyle=':', linewidth=0.5)
    
    plt.tight_layout()
    
    return fig_to_base64(fig)


def generate_class_performance_chart() -> str:
    """
    Generate chart showing overall class performance distribution
    
    Returns:
        Base64-encoded PNG image
    """
    students = StudentDB.query.all()
    
    if not students:
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.text(0.5, 0.5, 'No Data Available', ha='center', va='center', fontsize=16)
        ax.axis('off')
        return fig_to_base64(fig)
    
    student_averages = []
    student_names = []
    
    for student in students[:20]:  # Limit to 20 students
        grades = GradeDB.query.filter_by(student_id=student.student_id).all()
        if grades:
            final_grades = []
            for grade in grades:
                if grade.final_grade is None:
                    grade.calculate_final_grade()
                final_grades.append(grade.final_grade)
            
            avg = np.mean(final_grades)
            student_averages.append(avg)
            student_names.append(student.name[:15])
    
    if not student_averages:
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.text(0.5, 0.5, 'No Grade Data Available', ha='center', va='center', fontsize=16)
        ax.axis('off')
        return fig_to_base64(fig)
    
    # Sort by average
    sorted_data = sorted(zip(student_names, student_averages), key=lambda x: x[1], reverse=True)
    student_names, student_averages = zip(*sorted_data)
    
    colors = ['#4CAF50' if avg >= 80 else '#FFC107' if avg >= 70 else '#F44336' for avg in student_averages]
    
    fig, ax = plt.subplots(figsize=(14, 8))
    x = np.arange(len(student_names))
    bars = ax.barh(x, student_averages, color=colors, alpha=0.8, edgecolor='black', linewidth=1)
    
    # Add value labels
    for i, (bar, avg) in enumerate(zip(bars, student_averages)):
        ax.text(avg + 1, i, f'{avg:.1f}', va='center', fontsize=10, weight='bold')
    
    ax.set_yticks(x)
    ax.set_yticklabels(student_names)
    ax.set_xlabel('Average Grade', fontsize=12, weight='bold')
    ax.set_title('Class Performance Overview (Top Students)', fontsize=14, weight='bold', pad=20)
    ax.set_xlim(0, 105)
    ax.grid(True, axis='x', alpha=0.3, linestyle=':', linewidth=0.5)
    
    plt.tight_layout()
    
    return fig_to_base64(fig)
