import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const inputClass =
  "w-full bg-card border border-surface-border rounded-sm px-4 py-3 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber";

const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn(email, password);
    if (error) { setError(error.message); setLoading(false); return; }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="block font-display text-xl font-bold text-amber mb-10 text-center">
          Ratio x
        </Link>
        <h1 className="font-display text-2xl font-semibold text-foreground mb-2 text-center">Welcome back</h1>
        <p className="text-sm text-muted-foreground font-body text-center mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" required className={inputClass} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" required className={inputClass} />
          {error && <p className="text-xs text-drift-red font-body">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-amber text-background font-body text-sm font-medium py-3 rounded-sm hover:brightness-110 transition-all duration-200 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button onClick={() => signInWithGoogle()}
          className="mt-3 w-full bg-card border border-surface-border text-foreground font-body text-sm py-3 rounded-sm hover:bg-secondary transition-all">
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground font-body">
          No account?{" "}
          <Link to="/signup" className="text-amber hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
