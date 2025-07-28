import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import StudentsPage from "@/components/pages/StudentsPage";
import ClassesPage from "@/components/pages/ClassesPage"; 
import GradesPage from "@/components/pages/GradesPage";
import AttendancePage from "@/components/pages/AttendancePage";
import StudentDetailPage from "@/components/pages/StudentDetailPage";
import ReportsPage from "@/components/pages/ReportsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<StudentsPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/:id" element={<StudentDetailPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;