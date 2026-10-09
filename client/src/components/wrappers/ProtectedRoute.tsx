import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProtectedRoute = ({ children }: any) => {
    const { token } = useAuthContext();

    if(!token) {
        return <Navigate to="/login" />;
    }

    return children
}

export default ProtectedRoute;