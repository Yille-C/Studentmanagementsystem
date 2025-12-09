"""
OOP Models for Student Management System
Demonstrates inheritance, polymorphism, and custom iterator
"""

from datetime import datetime
from typing import List, Optional


class Person:
    """Base class representing a person"""
    
    def __init__(self, person_id: str, name: str, email: str, age: Optional[int] = None):
        self.person_id = person_id
        self.name = name
        self.email = email
        self.age = age
    
    def get_info(self) -> dict:
        """Polymorphic method - can be overridden by subclasses"""
        return {
            'id': self.person_id,
            'name': self.name,
            'email': self.email,
            'age': self.age,
            'type': 'Person'
        }
    
    def __str__(self):
        return f"Person(id={self.person_id}, name={self.name})"
    
    def __repr__(self):
        return self.__str__()


class Student(Person):
    """Student class inheriting from Person"""
    
    def __init__(self, person_id: str, name: str, email: str, course: str, 
                 enrollment_date: str, age: Optional[int] = None):
        super().__init__(person_id, name, email, age)
        self.course = course
        self.enrollment_date = enrollment_date
        self.student_type = 'Regular'
    
    def get_info(self) -> dict:
        """Override parent method - demonstrates polymorphism"""
        info = super().get_info()
        info.update({
            'course': self.course,
            'enrollment_date': self.enrollment_date,
            'student_type': self.student_type,
            'type': 'Student'
        })
        return info
    
    def calculate_gpa(self, grades: List[float]) -> float:
        """Calculate GPA from list of grades"""
        if not grades:
            return 0.0
        return sum(grades) / len(grades)
    
    def __str__(self):
        return f"Student(id={self.person_id}, name={self.name}, course={self.course})"


class HonorsStudent(Student):
    """Honors student class with additional features"""
    
    def __init__(self, person_id: str, name: str, email: str, course: str, 
                 enrollment_date: str, scholarship: Optional[str] = None, 
                 age: Optional[int] = None):
        super().__init__(person_id, name, email, course, enrollment_date, age)
        self.scholarship = scholarship
        self.student_type = 'Honors'
        self.min_gpa_required = 3.5
    
    def get_info(self) -> dict:
        """Override parent method - demonstrates polymorphism"""
        info = super().get_info()
        info.update({
            'scholarship': self.scholarship,
            'min_gpa_required': self.min_gpa_required,
            'type': 'HonorsStudent'
        })
        return info
    
    def is_eligible(self, gpa: float) -> bool:
        """Check if student maintains honors eligibility"""
        return gpa >= self.min_gpa_required
    
    def calculate_gpa(self, grades: List[float]) -> float:
        """Override with weighted calculation for honors students"""
        if not grades:
            return 0.0
        # Honors students get 0.5 bonus points
        base_gpa = sum(grades) / len(grades)
        return min(base_gpa + 0.5, 4.0)  # Cap at 4.0
    
    def __str__(self):
        return f"HonorsStudent(id={self.person_id}, name={self.name}, scholarship={self.scholarship})"


class ClassList:
    """Custom iterator class for looping through students"""
    
    def __init__(self, students: List[Student]):
        self.students = students
        self.index = 0
    
    def __iter__(self):
        """Make the class iterable"""
        self.index = 0
        return self
    
    def __next__(self):
        """Get next student in iteration"""
        if self.index >= len(self.students):
            raise StopIteration
        student = self.students[self.index]
        self.index += 1
        return student
    
    def __len__(self):
        """Get number of students in class"""
        return len(self.students)
    
    def add_student(self, student: Student):
        """Add a student to the class"""
        self.students.append(student)
    
    def remove_student(self, student_id: str):
        """Remove a student by ID"""
        self.students = [s for s in self.students if s.person_id != student_id]
    
    def get_student(self, student_id: str) -> Optional[Student]:
        """Get a specific student by ID"""
        for student in self.students:
            if student.person_id == student_id:
                return student
        return None
    
    def get_all_students(self) -> List[Student]:
        """Get all students as a list"""
        return self.students
    
    def get_honors_students(self) -> List[HonorsStudent]:
        """Get only honors students"""
        return [s for s in self.students if isinstance(s, HonorsStudent)]
    
    def get_regular_students(self) -> List[Student]:
        """Get only regular students"""
        return [s for s in self.students if not isinstance(s, HonorsStudent)]
    
    def __str__(self):
        return f"ClassList(count={len(self.students)})"


# Demonstration of polymorphism
def display_student_info(person: Person):
    """
    This function accepts any Person object and calls get_info()
    The actual behavior depends on the object type (polymorphism)
    """
    return person.get_info()
