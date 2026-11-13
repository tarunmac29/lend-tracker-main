
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentAdmin } from "../../services/auth.service";

function ProtectedRoute({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function verifySession() {
            try {
                const data = await getCurrentAdmin();
                setAdmin(data.admin);
            } catch (error) {
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        }

        verifySession();
    }, []);

    if (loading) {
        return <p>Checking authentication...</p>;
    }

    if (!admin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
