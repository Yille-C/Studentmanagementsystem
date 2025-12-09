# Student Management System - Test Cases

## Prerequisites
- Backend server running on http://localhost:5000
- Frontend running on http://localhost:5173 (or your Vite dev server port)
- Sample data loaded (5 students with grades and attendance)

---

## 1. Student Management Features

### Test Case 1.1: Add New Student
**Steps:**
1. Navigate to "Student Management" tab
2. Fill in the form:
   - Name: "Jane Doe"
   - Email: "jane.doe@example.com"
   - Age: 20
   - Course: "Computer Science"
3. Click "Add Student" button

**Expected Result:**
- Success message appears
- New student appears in the student list
- Form resets to empty
- Backend database should contain the new student

### Test Case 1.2: Update Existing Student
**Steps:**
1. Navigate to "Student Management" tab
2. Click "Edit" button on any student (e.g., Alice Johnson)
3. Modify the age to 23
4. Click "Update Student" button

**Expected Result:**
- Success message appears
- Student information updates in the list
- Changes persist after page refresh

### Test Case 1.3: Delete Student
**Steps:**
1. Navigate to "Student Management" tab
2. Click "Delete" button on any student
3. Confirm the deletion in the confirmation dialog

**Expected Result:**
- Student is removed from the list
- Associated grades and attendance records are also deleted (cascade)
- Changes persist after page refresh

### Test Case 1.4: View Student List
**Steps:**
1. Navigate to "Student Management" tab
2. Observe the student list

**Expected Result:**
- All students from the database are displayed
- Each student shows: ID, Name, Email, Age, Course
- Edit and Delete buttons are visible for each student

---

## 2. Grade Management Features

### Test Case 2.1: Add Grade for Student
**Steps:**
1. Navigate to "Grade Management" tab
2. Select a student from dropdown (e.g., "Alice Johnson")
3. Fill in the form:
   - Subject: "Database Systems"
   - Assignment: 85
   - Midterm: 88
   - Final: 90
4. Click "Add Grade" button

**Expected Result:**
- Success message appears
- Final grade is automatically calculated (weighted average)
- New grade appears in the grades table
- Data persists in MySQL database

### Test Case 2.2: View All Grades
**Steps:**
1. Navigate to "Grade Management" tab
2. Observe the grades table

**Expected Result:**
- All grades from database are displayed
- Table shows: Student Name, Subject, Assignment, Midterm, Final, Final Grade
- Grades are color-coded (green for passing, red for failing)

### Test Case 2.3: Final Grade Calculation
**Steps:**
1. Navigate to "Grade Management" tab
2. Add a grade with specific values:
   - Assignment: 80
   - Midterm: 90
   - Final: 85

**Expected Result:**
- Final Grade = (80 * 0.3) + (90 * 0.3) + (85 * 0.4) = 85
- Final grade is displayed correctly in the table

---

## 3. Attendance Tracking Features

### Test Case 3.1: Mark Student Present
**Steps:**
1. Navigate to "Attendance Tracking" tab
2. Select a student from the list
3. Select today's date
4. Click "Present" button

**Expected Result:**
- Success message appears
- Green checkmark appears next to the student's name
- Attendance record saved to database with status "present"

### Test Case 3.2: Mark Student Absent
**Steps:**
1. Navigate to "Attendance Tracking" tab
2. Select a student from the list
3. Select today's date
4. Click "Absent" button

**Expected Result:**
- Success message appears
- Red X appears next to the student's name
- Attendance record saved to database with status "absent"

### Test Case 3.3: View Attendance Statistics
**Steps:**
1. Navigate to "Attendance Tracking" tab
2. Observe the attendance summary section

**Expected Result:**
- Displays total attendance records
- Shows attendance rate percentage
- Shows present/absent counts
- Statistics update in real-time

### Test Case 3.4: Attendance Calendar View
**Steps:**
1. Navigate to "Attendance Tracking" tab
2. Select a student
3. Observe the calendar/history

**Expected Result:**
- Shows attendance history for the selected student
- Dates with attendance records are marked
- Color-coded (green for present, red for absent)

---

## 4. Data Analytics Features (NumPy Integration)

### Test Case 4.1: View Class Analytics
**Steps:**
1. Navigate to "Data Analytics" tab
2. Observe the "Class Analytics" section

**Expected Result:**
- Displays statistics calculated using NumPy:
  - Mean (average grade)
  - Median (middle value)
  - Mode (most common grade)
  - Standard Deviation
  - Variance
- Values are accurate based on all grades in database

### Test Case 4.2: Student-Specific Analytics
**Steps:**
1. Navigate to "Data Analytics" tab
2. Select a specific student from dropdown
3. Click "View Student Analytics"

**Expected Result:**
- Displays analytics for selected student only
- Shows mean, median, standard deviation of their grades
- Shows attendance percentage
- All calculations use NumPy functions

### Test Case 4.3: Subject-Specific Analytics
**Steps:**
1. Navigate to "Data Analytics" tab
2. Filter by subject (e.g., "Mathematics")

**Expected Result:**
- Analytics display only for the selected subject
- Shows class average for that subject
- Shows distribution of grades in that subject

### Test Case 4.4: Refresh Analytics
**Steps:**
1. Navigate to "Data Analytics" tab
2. Add a new grade in "Grade Management"
3. Return to "Data Analytics" tab
4. Click refresh button

**Expected Result:**
- Analytics update to include the new grade
- All statistical values recalculate correctly

---

## 5. Predictions (Machine Learning) Features

### Test Case 5.1: Predict Student Grade
**Steps:**
1. Navigate to "Predictions" tab
2. Select a student who has at least 3 grades
3. Observe the prediction section

**Expected Result:**
- Shows predicted next semester grade using linear regression
- Displays confidence level
- Shows trend (improving/declining/stable)
- Prediction is based on historical grade data

### Test Case 5.2: View All Student Predictions
**Steps:**
1. Navigate to "Predictions" tab
2. Observe the predictions table

**Expected Result:**
- Displays predictions for all students
- Shows predicted grade for each student
- Shows performance trend indicators
- Color-coded warnings for at-risk students

### Test Case 5.3: Performance Pattern Analysis
**Steps:**
1. Navigate to "Predictions" tab
2. Select a student with varying grades
3. View the "Performance Pattern" section

**Expected Result:**
- Identifies pattern (improving, declining, consistent)
- Shows confidence level
- Provides recommendations based on pattern
- Uses scikit-learn or NumPy for analysis

### Test Case 5.4: Custom Grade Prediction
**Steps:**
1. Navigate to "Predictions" tab
2. Enter custom grade values in the input fields
3. Click "Predict" button

**Expected Result:**
- System predicts next grade based on input
- Uses trained linear regression model
- Shows predicted value and confidence

---

## 6. Visual Reports (Matplotlib Integration)

### Test Case 6.1: View Grade Distribution Pie Chart
**Steps:**
1. Navigate to "Visual Reports" tab
2. Click "Load Backend Charts" button
3. Observe the "Grade Distribution" chart

**Expected Result:**
- Pie chart displays generated by Matplotlib on backend
- Shows distribution of grade ranges (A, B, C, D, F)
- Chart is rendered as base64 PNG image
- Legend shows percentages

### Test Case 6.2: View Grade Progress Line Chart
**Steps:**
1. Navigate to "Visual Reports" tab
2. Click "Load Backend Charts" button
3. View the "Grade Progress" section

**Expected Result:**
- Line chart shows grade trends over time
- Generated by Matplotlib on backend
- X-axis: time/assignment sequence
- Y-axis: grade values
- Multiple lines for different subjects (if applicable)

### Test Case 6.3: View Attendance Bar Chart
**Steps:**
1. Navigate to "Visual Reports" tab
2. Click "Load Backend Charts" button
3. View the "Attendance" chart

**Expected Result:**
- Bar chart showing attendance statistics
- Generated by Matplotlib on backend
- Displays present vs absent counts per student
- Color-coded bars (green for present, red for absent)

### Test Case 6.4: Toggle Frontend/Backend Charts
**Steps:**
1. Navigate to "Visual Reports" tab
2. Click "Use Frontend Charts" button
3. Click "Use Backend Charts" button

**Expected Result:**
- Frontend button shows Recharts (React library)
- Backend button shows Matplotlib charts
- Toggle works smoothly without errors
- Both chart types display same data

### Test Case 6.5: Class Performance Chart
**Steps:**
1. Navigate to "Visual Reports" tab
2. Click "Load Backend Charts" button
3. View "Class Performance" section

**Expected Result:**
- Bar chart comparing all students' average grades
- Generated by Matplotlib
- Shows student names on X-axis
- Average grades on Y-axis
- Bars color-coded by performance level

---

## 7. Data Persistence (JSON) Features

### Test Case 7.1: Export Data to JSON
**Steps:**
1. Navigate to "Data Persistence" tab
2. Click "Export from Backend" button

**Expected Result:**
- JSON file downloads automatically
- Filename includes current date (e.g., student-data-backup-2025-12-09.json)
- File contains all students, grades, and attendance records
- Data is properly formatted JSON

### Test Case 7.2: Import Data from JSON
**Steps:**
1. Navigate to "Data Persistence" tab
2. Click "Import to Backend" button
3. Select a valid JSON file with student data
4. Confirm the import

**Expected Result:**
- Success message shows import statistics
- Data is imported into MySQL database
- Page refreshes to show imported data
- Existing data is preserved (no duplicates if IDs match)

### Test Case 7.3: Browser Storage Auto-Save
**Steps:**
1. Add a new student
2. Close the browser tab
3. Reopen the application

**Expected Result:**
- Auto-save checkbox is enabled by default
- Data persists in localStorage
- Application loads previous state (if backend is unavailable)

### Test Case 7.4: Clear All Data
**Steps:**
1. Navigate to "Data Persistence" tab
2. Click "Clear All Data" button
3. Confirm the action

**Expected Result:**
- Confirmation dialog appears
- All students, grades, and attendance records are removed
- Empty state is displayed in all tabs
- Database is cleared

### Test Case 7.5: View Data Summary
**Steps:**
1. Navigate to "Data Persistence" tab
2. Observe the "Current Data Summary" section

**Expected Result:**
- Shows count of students
- Shows count of grade records
- Shows count of attendance records
- Numbers update in real-time

---

## 8. REST API Integration Features

### Test Case 8.1: API Connection Test
**Steps:**
1. Open browser developer console (F12)
2. Navigate to any tab in the application
3. Observe network requests

**Expected Result:**
- API calls to http://localhost:5000/api/* are visible
- Requests return status 200 (success)
- CORS headers are properly configured
- Response data is in JSON format

### Test Case 8.2: Error Handling
**Steps:**
1. Stop the Flask backend server
2. Try to add a new student
3. Observe the error message

**Expected Result:**
- User-friendly error message appears
- Application doesn't crash
- Console shows detailed error for debugging

### Test Case 8.3: Loading States
**Steps:**
1. Navigate to "Data Analytics" tab
2. Observe the loading indicator while data fetches

**Expected Result:**
- Loading spinner/message appears during API calls
- UI is disabled during loading
- Loading state clears when data arrives

### Test Case 8.4: Real-time Data Sync
**Steps:**
1. Open the app in two browser tabs
2. Add a student in Tab 1
3. Navigate to Student Management in Tab 2
4. Refresh Tab 2

**Expected Result:**
- New student appears in Tab 2 after refresh
- Data is synchronized through the backend
- Both tabs show consistent data

---

## 9. Database (MySQL) Integration

### Test Case 9.1: Data Persistence After Restart
**Steps:**
1. Add students, grades, and attendance
2. Stop both frontend and backend servers
3. Restart both servers
4. Open the application

**Expected Result:**
- All data is still present
- Data is loaded from MySQL database
- No data loss occurs

### Test Case 9.2: Cascade Delete
**Steps:**
1. Add a student with grades and attendance
2. Delete the student
3. Check the grades and attendance tables

**Expected Result:**
- Student is deleted
- All associated grades are deleted (foreign key cascade)
- All associated attendance records are deleted
- No orphaned records remain

### Test Case 9.3: Transaction Integrity
**Steps:**
1. Import a large JSON file with many records
2. Observe the import process

**Expected Result:**
- Either all records import successfully, or none do (atomicity)
- No partial imports if there's an error
- Database maintains consistency

---

## 10. OOP (Object-Oriented Programming) Features

### Test Case 10.1: Student Class Hierarchy
**Steps:**
1. Check backend logs when adding a student
2. Observe the OOP structure in `backend/models.py`

**Expected Result:**
- Person base class exists
- Student class inherits from Person
- HonorsStudent class inherits from Student
- Polymorphism is demonstrated (method overriding)

### Test Case 10.2: Iterator Pattern
**Steps:**
1. Call the `/students` API endpoint
2. Check backend logs

**Expected Result:**
- ClassList iterator is used to iterate through students
- Demonstrates `__iter__` and `__next__` methods
- OOP iterator pattern is implemented

---

## Performance Tests

### Test Case 11.1: Large Dataset Handling
**Steps:**
1. Import a JSON file with 100+ students
2. Navigate through all tabs

**Expected Result:**
- Application remains responsive
- Charts render without lag
- Analytics calculate quickly
- No browser crashes

### Test Case 11.2: Concurrent Operations
**Steps:**
1. Add multiple students quickly (click Add button repeatedly)
2. Observe the results

**Expected Result:**
- All students are added successfully
- No race conditions occur
- Data integrity is maintained
- API handles concurrent requests

---

## Browser Compatibility Tests

### Test Case 12.1: Cross-Browser Testing
**Steps:**
1. Open application in Chrome, Firefox, Edge
2. Test all features in each browser

**Expected Result:**
- All features work consistently
- Charts render correctly
- API calls succeed
- UI displays properly

### Test Case 12.2: Responsive Design
**Steps:**
1. Resize browser window to mobile size (375px width)
2. Navigate through all tabs

**Expected Result:**
- Layout adapts to screen size
- All buttons remain accessible
- Charts scale appropriately
- Tables are scrollable

---

## Security Tests

### Test Case 13.1: SQL Injection Prevention
**Steps:**
1. Try to add a student with name: `'; DROP TABLE students; --`
2. Submit the form

**Expected Result:**
- Input is properly sanitized
- SQLAlchemy ORM prevents SQL injection
- No database tables are dropped
- Invalid input is rejected or escaped

### Test Case 13.2: XSS Prevention
**Steps:**
1. Try to add a student with name: `<script>alert('XSS')</script>`
2. View the student list

**Expected Result:**
- Script is not executed
- React automatically escapes HTML
- Alert does not appear
- Text is displayed as plain text

---

## Integration Test Scenarios

### Test Case 14.1: Complete User Journey
**Steps:**
1. Add a new student "Test Student"
2. Add 3 grades for this student (different subjects)
3. Mark attendance for this student (5 days present, 2 absent)
4. View analytics for this student
5. Check predictions for this student
6. View visual reports including this student
7. Export all data to JSON
8. Delete the student

**Expected Result:**
- All operations complete successfully
- Data flows correctly between all components
- No errors occur
- Data is consistent across all tabs

### Test Case 14.2: Backup and Restore
**Steps:**
1. Export current data to JSON
2. Clear all data
3. Import the JSON file back

**Expected Result:**
- Data is fully restored
- All students, grades, and attendance match original
- Charts and analytics work with restored data
- No data corruption occurs

---

## Edge Cases

### Test Case 15.1: Empty Database
**Steps:**
1. Start with cleared database
2. Navigate through all tabs

**Expected Result:**
- Application handles empty state gracefully
- "No data" messages are displayed
- No JavaScript errors
- Charts show empty states

### Test Case 15.2: Invalid Input Handling
**Steps:**
1. Try to add a student with age = -5
2. Try to add a grade with value = 150
3. Try to add a student with empty name

**Expected Result:**
- Validation prevents invalid data
- Error messages guide user
- Database maintains integrity
- No invalid data is stored

### Test Case 15.3: Network Failure
**Steps:**
1. Disconnect from network mid-operation
2. Try to add a student

**Expected Result:**
- Error message indicates network issue
- Application doesn't crash
- User can retry after reconnecting
- No partial data is saved

---

## Notes for Testing

- Test each feature independently first
- Then test integration between features
- Check browser console for any errors
- Monitor backend terminal for API logs
- Verify data in MySQL database directly using a DB client
- Test with both sample data and custom data
- Document any bugs or unexpected behavior
