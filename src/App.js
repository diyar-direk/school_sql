import { Route, Routes, useLocation } from "react-router-dom";
import AllTeachers from "./pages/teachers/AllTeachers";
import AddTeacher from "./pages/teachers/AddTeacher";
import TeacherProfile from "./pages/teachers/TeacherProfile";
import Attendence from "./pages/students/Attendence";
import AllStudents from "./pages/students/AllStudents";
import Classes from "./pages/classes/Classes";
import Login from "./pages/Login";
import Subjects from "./pages/subjects/Subjects";
import ExamSchedule from "./pages/exams/ExamsSchedule";
import AddStudent from "./pages/students/AddStudent";
import AddExam from "./pages/exams/AddExam";
import StudentProfile from "./pages/students/StudentProfile";
import ExamResult from "./pages/exams/ExamResult";
import TimeTable from "./pages/students/timeTable";
import AddExamResult from "./pages/exams/AddExamResult";
import UpdateTeacher from "./pages/teachers/UpdateTeacher";
import UpdateExamSchedule from "./pages/exams/UpdateExamSchedule";
import UpdateStudent from "./pages/students/UpdateStudent";
import { useEffect } from "react";
import NotFound from "./components/NotFound";
import Dashboard from "./pages/Dashboard";
import Auth from "./Auth/Auth";
import Refresh from "./Auth/Refersh";
import AdminAuth from "./Auth/AdminAuth";
import TeacherAuth from "./Auth/TeacherAuth";
import AllAdmins from "./Auth/AllAdmins";
import AddAdmin from "./Auth/AddAdmin";
import UpdateAdmin from "./Auth/UpdateAdmin";
import AllUsers from "./Auth/AllUsers";
import AddUser from "./Auth/AddUser";
import AllQuizes from "./pages/quizes/AllQuizes";
import AddQuiz from "./pages/quizes/AddQuiz";
import UpdateQuiz from "./pages/quizes/UpdateQuiz";
import StudentAuth from "./Auth/StudentAuth";
import TakeQuiz from "./pages/quizes/TakeQuiz";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Login />} />

        <Route element={<Refresh />}>
          <Route element={<Auth />}>
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="*" element={<NotFound />} />

              <Route element={<AdminAuth />}>
                <Route path="all_admins" element={<AllAdmins />} />
                <Route path="add_admin" element={<AddAdmin />} />
                <Route path="all_users" element={<AllUsers />} />
                <Route path="add_user" element={<AddUser />} />
                <Route path="update_admin/:id" element={<UpdateAdmin />} />
                <Route path="add_teacher" element={<AddTeacher />} />
                <Route path="add_student" element={<AddStudent />} />
                <Route path="add_exam_result" element={<AddExamResult />} />
                <Route path="add_exam" element={<AddExam />} />
                <Route path="add_quiz" element={<AddQuiz />} />
                <Route path="update_quiz/:id" element={<UpdateQuiz />} />
                <Route path="update_teacher/:id" element={<UpdateTeacher />} />
                <Route path="update_student/:id" element={<UpdateStudent />} />
                <Route
                  path="update_exam/:id"
                  element={<UpdateExamSchedule />}
                />
              </Route>

              <Route element={<TeacherAuth />}>
                <Route path="all_teachers" element={<AllTeachers />} />
                <Route
                  path="teacher_profile/:id"
                  element={<TeacherProfile />}
                />
                <Route path="all_students" element={<AllStudents />} />
                <Route path="attendence" element={<Attendence />} />
              </Route>
              <Route path="all_quizzes" element={<AllQuizes />} />
              <Route path="student_profile/:id" element={<StudentProfile />} />
              <Route path="time_table" element={<TimeTable />} />
              <Route path="classes" element={<Classes />} />
              <Route path="subjects" element={<Subjects />} />
              <Route path="exams_schedule" element={<ExamSchedule />} />
              <Route path="exams_result" element={<ExamResult />} />

              <Route element={<StudentAuth />}>
                <Route path="take_quiz/:id" element={<TakeQuiz />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
