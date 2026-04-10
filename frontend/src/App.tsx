import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "./hooks/useRedux";
import { fetchCurrentUser } from "./store/slices/authSlice";
import AuthPage from "./components/auth/AuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import Spinner from "./components/common/Spinner";

const App = () => {
  const dispatch = useAppDispatch();
  const { token, user, isLoading } = useAppSelector((s) => s.auth);

  // Re-validate token on app load
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

  // Show loading while re-validating session
  if (token && !user && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#e2e8f0",
            border: "1px solid rgba(51, 65, 85, 0.5)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#818cf8", secondary: "#1e293b" },
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "#1e293b" },
          },
        }}
      />
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
