import React from "react";
import { User, Mail, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../services";
export default function SignupPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;
        setError(null);
        setSubmitting(true);
        try {
            await UserService.createUser({ fullName, email, password });
            navigate("/login?signup=success", { replace: true });
        } catch (err: any) {
            setError(err?.message ?? "Failed to create account");
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <div className="min-h-screen w-full flex bg-slate-100">
            <div className="hidden md:block md:flex-1 overflow-hidden">
                <img
                    src="../../public/img/loginbg.jpg"
                    alt="Jewelry"
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex-1 flex items-center justify-center px-4 md:px-10 lg:px-16 bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/70 shadow-2xl backdrop-blur-xl px-8 py-8 md:px-10 md:py-10 space-y-6">
                    <h2 className="text-3xl font-bold text-center text-slate-900">
                        Sign up
                    </h2>

                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full name"
                                    className="w-full rounded-full border border-slate-300/80 bg-white/80 px-4 py-3 pr-11 text-sm outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                    required
                                />
                                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-lg text-slate-500/80">
                                    <User />
                                </span>
                            </div>
                        </div>

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
                                    required
                                />
                                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-lg text-slate-500/80">
                                    <Mail />
                                </span>
                            </div>
                        </div>

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
                                    required
                                />
                                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-lg text-slate-500/80">
                                    <KeyRound />
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-1 w-full rounded-full bg-slate-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-600 disabled:opacity-60"
                        >
                            {submitting ? "Creating..." : "Create account"}
                        </button>
                    </form>

                    <div className="text-center text-sm">
                        <a href="/login" className="text-slate-700 hover:text-sky-700 hover:underline">
                            Already have an account? Log in
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}