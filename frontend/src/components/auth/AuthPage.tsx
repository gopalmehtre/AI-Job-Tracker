import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { login, register, clearError } from "../../store/slices/authSlice";
import Spinner from "../common/Spinner";

const AuthPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login({ email, password }));
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
            JobFlow
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            AI-powered job application tracker
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
