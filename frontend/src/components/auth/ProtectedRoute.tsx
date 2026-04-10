import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { token } = useAppSelector((s) => s.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
