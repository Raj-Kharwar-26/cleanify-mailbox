
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [navigate, user, isLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome to CleanMail</h1>
            <p className="text-foreground/70">
              Log in or create an account to get started
            </p>
          </div>
          <div className="glass-panel p-8">
            <AuthForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
