import StudentAuth from "./Auth/StudentAuth";
import TakeQuiz from "./pages/quizes/TakeQuiz";
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
