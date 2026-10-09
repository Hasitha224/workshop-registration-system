import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const AppHeader = () => {
    const navigate = useNavigate();
    const { logout } = useAuthContext();

    const handleLogout = () => {
        logout(); 
        void navigate("/login");
    }

    return (
        <header className="sticky top-0 z-50 w-full h-16 bg-primary border-b shadow-sm backdrop-blur-md flex items-center justify-between px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg text-white shadow-md">
                    <img
                    src="/src/assets/logo.png" 
                    alt="Workshop Logo"
                    className="w-8 h-8 object-contain"
                    />
                </div>
                <Link to="/" className="block">
                    <h1 className="text-lg xl:text-xl font-semibold tracking-tight text-white cursor-pointer">
                        Workshop Registration System
                    </h1>
                </Link>
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white hover:text-foreground transition-all cursor-pointer"
            >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
            </button>
        </header>
    );
}

export default AppHeader
