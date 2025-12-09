"""
Test Script to Verify Backend Functionality
Run this after setting up the database to test all features
"""

import requests
import json

BASE_URL = 'http://localhost:5000/api'

def test_health():
    """Test health check"""
    print("\n🔍 Testing Health Check...")
    response = requests.get(f'{BASE_URL}/health')
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_add_student():
    """Test adding a student"""
    print("\n📝 Testing Add Student...")
    data = {
        'id': 'TEST001',
        'name': 'Test Student',
        'email': 'test@example.com',
        'course': 'Computer Science',
        'enrollmentDate': '2024-01-15',
        'age': 20,
        'studentType': 'Regular'
    }
    response = requests.post(f'{BASE_URL}/students', json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 201

def test_get_students():
    """Test getting all students"""
    print("\n📋 Testing Get Students...")
    response = requests.get(f'{BASE_URL}/students')
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Number of students: {data.get('count', 0)}")
    return response.status_code == 200

def test_add_grade():
    """Test adding a grade"""
    print("\n🎯 Testing Add Grade...")
    data = {
        'studentId': 'TEST001',
        'subject': 'Mathematics',
        'midterm': 85,
        'finals': 90,
        'quizzes': 88,
        'projects': 92
    }
    response = requests.post(f'{BASE_URL}/grades', json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 201

def test_add_attendance():
    """Test adding attendance"""
    print("\n📅 Testing Add Attendance...")
    data = {
        'studentId': 'TEST001',
        'date': '2024-01-15',
        'status': 'present'
    }
    response = requests.post(f'{BASE_URL}/attendance', json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 201

def test_analytics():
    """Test analytics"""
    print("\n📊 Testing Analytics...")
    response = requests.get(f'{BASE_URL}/analytics/student/TEST001')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        analytics = response.json().get('analytics', {})
        print(f"Mean: {analytics.get('mean')}")
        print(f"GPA: {analytics.get('gpa')}")
        print(f"Attendance: {analytics.get('attendance_percentage')}%")
    return response.status_code == 200

def test_prediction():
    """Test prediction"""
    print("\n🔮 Testing Prediction...")
    response = requests.get(f'{BASE_URL}/predictions/student/TEST001?subject=Mathematics')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        prediction = response.json().get('prediction', {})
        if 'error' not in prediction:
            print(f"Predicted Grade: {prediction.get('predicted_grade')}")
            print(f"Trend: {prediction.get('trend')}")
            print(f"Confidence: {prediction.get('confidence')}")
        else:
            print(f"Note: {prediction.get('error')}")
    return response.status_code == 200

def test_chart():
    """Test chart generation"""
    print("\n📈 Testing Chart Generation...")
    response = requests.get(f'{BASE_URL}/charts/grade-distribution')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        if 'chart' in data:
            print(f"Chart generated (base64 length: {len(data['chart'])})")
    return response.status_code == 200

def test_export():
    """Test data export"""
    print("\n💾 Testing Data Export...")
    response = requests.get(f'{BASE_URL}/data/export')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json().get('data', {})
        print(f"Students: {len(data.get('students', []))}")
        print(f"Grades: {len(data.get('grades', []))}")
        print(f"Attendance: {len(data.get('attendance', []))}")
    return response.status_code == 200

def test_oop_demo():
    """Test OOP demonstration"""
    print("\n🎓 Testing OOP Demo...")
    response = requests.get(f'{BASE_URL}/oop/demo')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Concepts demonstrated: {list(data.get('concepts', {}).keys())}")
    return response.status_code == 200

def cleanup():
    """Clean up test data"""
    print("\n🧹 Cleaning up test data...")
    try:
        requests.delete(f'{BASE_URL}/students/TEST001')
        print("Test data cleaned up")
    except:
        pass

def run_all_tests():
    """Run all tests"""
    print("="*60)
    print("🧪 BACKEND API TESTING")
    print("="*60)
    
    tests = [
        ('Health Check', test_health),
        ('Add Student', test_add_student),
        ('Get Students', test_get_students),
        ('Add Grade', test_add_grade),
        ('Add Attendance', test_add_attendance),
        ('Analytics', test_analytics),
        ('Prediction', test_prediction),
        ('Chart Generation', test_chart),
        ('Data Export', test_export),
        ('OOP Demo', test_oop_demo)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, success))
        except Exception as e:
            print(f"❌ Error: {e}")
            results.append((name, False))
    
    # Cleanup
    cleanup()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
    
    print("="*60)
    print(f"Results: {passed}/{total} tests passed")
    print("="*60)

if __name__ == '__main__':
    print("\n⚠️  Make sure the Flask server is running on http://localhost:5000")
    print("⚠️  Make sure MySQL is configured and running\n")
    
    input("Press Enter to start testing...")
    
    run_all_tests()
