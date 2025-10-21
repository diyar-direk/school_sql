import { Route, Routes, useLocation } from "react-router-dom";
import TeacherProfile from "./pages/teachers/TeacherProfile";
import Attendence from "./pages/students/Attendence";
import StudentProfile from "./pages/students/StudentProfile";
import TimeTable from "./pages/students/timeTable";
import { useEffect } from "react";
import NotFound from "./components/NotFound";
import AddQuiz from "./pages/quizes/AddQuiz";
import UpdateQuiz from "./pages/quizes/UpdateQuiz";
import StudentAuth from "./Auth/StudentAuth";
import TakeQuiz from "./pages/quizes/TakeQuiz";
import AllQuizes from "./pages/quizes/AllQuizes";
import { Toaster } from "react-hot-toast";
import AppRouter from "./router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: false,
    },
  },
});

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" />
      {/* <Routes>
        <Route path="*" element={<NotFound />} />

            <Route path="*" element={<NotFound />} />
              <Route path="admin_profile" element={<AdminProfile />} />
              <Route path="all_users" element={<AllUsers />} />
              <Route path="add_user" element={<AddUser />} />
              <Route path="add_quiz" element={<AddQuiz />} />
              <Route path="update_quiz/:id" element={<UpdateQuiz />} />

              <Route path="teacher_profile/:id" element={<TeacherProfile />} />
              <Route path="attendence" element={<Attendence />} />

            <Route path="all_quizzes" element={<AllQuizes />} />
            <Route path="student_profile/:id" element={<StudentProfile />} />
            <Route path="time_table" element={<TimeTable />} />

            <Route element={<StudentAuth />}>
              <Route path="take_quiz/:id" element={<TakeQuiz />} />
            </Route>
    
      </Routes> */}
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </div>
  );
}

export default App;
