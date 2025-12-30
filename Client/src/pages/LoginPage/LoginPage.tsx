import React from "react";
import { Mail, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services";
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await AuthService.login({ email, password, rememberMe: remember });

      // Check user role and redirect accordingly
      const userInfo = await AuthService.me();
      if (userInfo.roles && userInfo.roles.length > 0) {
        const role = userInfo.roles[0].toLowerCase();
        if (role === "manager" || role === "employee") {
          navigate("/manager", { replace: true });
        } else if (role === "customer") {
          navigate("/", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };
  const startGoogleLogin = () => {
    const API_BASE_URL: string | undefined =
      (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;
    const base = API_BASE_URL ? new URL(API_BASE_URL) : new URL(window.location.origin);
    const url = new URL("/api/auth/google", base);
    const returnUrl = `${window.location.origin}/manager`;
    url.searchParams.set("returnUrl", returnUrl);
    window.location.href = url.toString();
  };
  return (
    <div className="min-h-screen w-full flex bg-slate-100">
      {/* Left: image */}
      <div className="hidden md:block md:flex-1 overflow-hidden">
        <img src="../../img/loginbg.jpg" alt="Jewelry" className="h-full w-full object-cover" />
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-10 lg:px-16 bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/70 shadow-2xl backdrop-blur-xl px-8 py-8 md:px-10 md:py-10 space-y-6">
          <h2 className="text-3xl font-bold text-center text-slate-900">Login</h2>

          {/* Username */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-full border border-slate-300/80 bg-white/80 px-4 py-3 pr-11 text-sm outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-lg text-slate-500/80">
                <Mail />
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-full border border-slate-300/80 bg-white/80 px-4 py-3 pr-11 text-sm outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-lg text-slate-500/80">
                <KeyRound />
              </span>
            </div>
          </div>

          {/* Remember + Forgot removed as requested */}

          {error && (
            <div className="text-sm text-red-600" role="alert">
              {error}
            </div>
          )}
          {/* Login button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={submitting}
            className="mt-1 w-full rounded-full bg-slate-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-600 disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
          <div className="text-center text-sm">
            <a href="/signup" className="text-slate-700 hover:text-sky-700 hover:underline">
              Don&apos;t have an account? Sign up
            </a>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-300/70" />
            <span>Or</span>
            <div className="h-px flex-1 bg-slate-300/70" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={startGoogleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-200 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-300"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[14px] font-bold text-red-500">
              <img
                src="../../../img/google.png"
                alt="Google Logo"
                className="h-full w-full object-cover"
              />
            </span>
            <span>Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
