import { Route, Routes, useLocation } from "react-router-dom";
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

              <Route path="admin_profile" element={<AdminProfile />} />
              <Route path="add_quiz" element={<AddQuiz />} />
              <Route path="update_quiz/:id" element={<UpdateQuiz />} />

              <Route path="attendence" element={<Attendence />} />

            <Route path="all_quizzes" element={<AllQuizes />} />
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
