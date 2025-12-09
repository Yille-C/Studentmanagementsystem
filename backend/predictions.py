"""
Machine Learning Prediction Module
Uses Linear Regression to predict future grades
"""

import numpy as np
from typing import List, Dict, Optional
from database import GradeDB


def linear_regression_predict(grades: List[float], periods_ahead: int = 1) -> Dict:
    """
    Predict future grades using linear regression
    
    Args:
        grades: List of past grades (chronological order)
        periods_ahead: Number of periods to predict ahead
    
    Returns:
        Dictionary containing prediction results
    """
    if not grades or len(grades) < 2:
        return {
            'error': 'Need at least 2 grades for prediction',
            'predicted_grade': None
        }
    
    # Create x values (time periods: 0, 1, 2, ...)
    x = np.arange(len(grades))
    y = np.array(grades)
    
    # Perform linear regression using numpy polyfit (degree 1 = linear)
    # Returns coefficients [slope, intercept]
    coefficients = np.polyfit(x, y, 1)
    slope = coefficients[0]
    intercept = coefficients[1]
    
    # Predict next grade(s)
    next_period = len(grades) + periods_ahead - 1
    predicted_grade = slope * next_period + intercept
    
    # Ensure grade is within valid range (0-100)
    predicted_grade = max(0, min(100, predicted_grade))
    
    # Calculate R-squared (coefficient of determination)
    y_pred = slope * x + intercept
    ss_res = np.sum((y - y_pred) ** 2)
    ss_tot = np.sum((y - np.mean(y)) ** 2)
    r_squared = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0
    
    # Determine trend
    if slope > 0.5:
        trend = 'improving'
    elif slope < -0.5:
        trend = 'declining'
    else:
        trend = 'stable'
    
    return {
        'predicted_grade': round(float(predicted_grade), 2),
        'slope': round(float(slope), 4),
        'intercept': round(float(intercept), 2),
        'r_squared': round(float(r_squared), 4),
        'trend': trend,
        'confidence': 'high' if r_squared > 0.7 else 'medium' if r_squared > 0.4 else 'low',
        'past_grades': grades,
        'periods_predicted': periods_ahead
    }


def polynomial_regression_predict(grades: List[float], degree: int = 2, periods_ahead: int = 1) -> Dict:
    """
    Predict future grades using polynomial regression
    
    Args:
        grades: List of past grades
        degree: Polynomial degree (2 for quadratic, 3 for cubic, etc.)
        periods_ahead: Number of periods to predict ahead
    
    Returns:
        Dictionary containing prediction results
    """
    if not grades or len(grades) < degree + 1:
        return {
            'error': f'Need at least {degree + 1} grades for degree {degree} polynomial',
            'predicted_grade': None
        }
    
    x = np.arange(len(grades))
    y = np.array(grades)
    
    # Perform polynomial regression
    coefficients = np.polyfit(x, y, degree)
    
    # Predict next grade
    next_period = len(grades) + periods_ahead - 1
    predicted_grade = np.polyval(coefficients, next_period)
    
    # Ensure grade is within valid range
    predicted_grade = max(0, min(100, predicted_grade))
    
    # Calculate R-squared
    y_pred = np.polyval(coefficients, x)
    ss_res = np.sum((y - y_pred) ** 2)
    ss_tot = np.sum((y - np.mean(y)) ** 2)
    r_squared = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0
    
    return {
        'predicted_grade': round(float(predicted_grade), 2),
        'degree': degree,
        'r_squared': round(float(r_squared), 4),
        'confidence': 'high' if r_squared > 0.7 else 'medium' if r_squared > 0.4 else 'low',
        'past_grades': grades,
        'periods_predicted': periods_ahead
    }


def predict_student_grade(student_id: str, subject: str, periods_ahead: int = 1) -> Dict:
    """
    Predict a student's next grade for a specific subject
    
    Args:
        student_id: Student ID
        subject: Subject name
        periods_ahead: Number of periods to predict ahead
    
    Returns:
        Prediction results dictionary
    """
    # Get all grades for this student and subject
    grade_records = GradeDB.query.filter_by(
        student_id=student_id,
        subject=subject
    ).order_by(GradeDB.created_at).all()
    
    if not grade_records:
        return {
            'error': 'No grade history found for this student and subject',
            'student_id': student_id,
            'subject': subject
        }
    
    # Extract component grades for analysis
    # We'll use final grades, but also show predictions for each component
    final_grades = []
    midterm_grades = []
    finals_grades = []
    quiz_grades = []
    project_grades = []
    
    for record in grade_records:
        if record.final_grade is None:
            record.calculate_final_grade()
        
        final_grades.append(record.final_grade)
        midterm_grades.append(record.midterm)
        finals_grades.append(record.finals)
        quiz_grades.append(record.quizzes)
        project_grades.append(record.projects)
    
    # Predict final grade
    prediction = linear_regression_predict(final_grades, periods_ahead)
    
    # Also predict individual components
    component_predictions = {}
    if len(midterm_grades) >= 2:
        component_predictions['midterm'] = linear_regression_predict(midterm_grades, periods_ahead)['predicted_grade']
    if len(finals_grades) >= 2:
        component_predictions['finals'] = linear_regression_predict(finals_grades, periods_ahead)['predicted_grade']
    if len(quiz_grades) >= 2:
        component_predictions['quizzes'] = linear_regression_predict(quiz_grades, periods_ahead)['predicted_grade']
    if len(project_grades) >= 2:
        component_predictions['projects'] = linear_regression_predict(project_grades, periods_ahead)['predicted_grade']
    
    prediction['student_id'] = student_id
    prediction['subject'] = subject
    prediction['component_predictions'] = component_predictions
    prediction['total_records'] = len(grade_records)
    
    return prediction


def predict_all_students_grades(subject: str = None) -> List[Dict]:
    """
    Predict next grades for all students
    
    Args:
        subject: Optional subject filter
    
    Returns:
        List of prediction results for each student
    """
    from database import StudentDB
    
    students = StudentDB.query.all()
    predictions = []
    
    for student in students:
        # Get subjects for this student
        if subject:
            subjects = [subject]
        else:
            grade_records = GradeDB.query.filter_by(student_id=student.student_id).all()
            subjects = list(set(g.subject for g in grade_records))
        
        for subj in subjects:
            prediction = predict_student_grade(student.student_id, subj)
            if 'error' not in prediction:
                predictions.append({
                    'student_name': student.name,
                    'student_id': student.student_id,
                    'subject': subj,
                    'predicted_grade': prediction['predicted_grade'],
                    'trend': prediction['trend'],
                    'confidence': prediction['confidence']
                })
    
    return predictions


def batch_predict(student_grades_map: Dict[str, List[float]]) -> Dict[str, Dict]:
    """
    Perform batch predictions for multiple students
    
    Args:
        student_grades_map: Dictionary mapping student IDs to their grade lists
    
    Returns:
        Dictionary mapping student IDs to their predictions
    """
    results = {}
    
    for student_id, grades in student_grades_map.items():
        results[student_id] = linear_regression_predict(grades)
    
    return results


def calculate_prediction_accuracy(actual_grades: List[float], predicted_grades: List[float]) -> Dict:
    """
    Calculate accuracy metrics for predictions
    
    Args:
        actual_grades: Actual grades observed
        predicted_grades: Predicted grades
    
    Returns:
        Dictionary with accuracy metrics
    """
    if len(actual_grades) != len(predicted_grades):
        return {'error': 'Grade lists must be same length'}
    
    actual = np.array(actual_grades)
    predicted = np.array(predicted_grades)
    
    # Mean Absolute Error
    mae = np.mean(np.abs(actual - predicted))
    
    # Mean Squared Error
    mse = np.mean((actual - predicted) ** 2)
    
    # Root Mean Squared Error
    rmse = np.sqrt(mse)
    
    # Mean Absolute Percentage Error
    mape = np.mean(np.abs((actual - predicted) / actual)) * 100
    
    return {
        'mean_absolute_error': round(float(mae), 2),
        'mean_squared_error': round(float(mse), 2),
        'root_mean_squared_error': round(float(rmse), 2),
        'mean_absolute_percentage_error': round(float(mape), 2)
    }
