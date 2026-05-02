import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Lock, LogIn, Loader2, HeartPulse, Activity } from "lucide-react";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!", { duration: 1000 });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error logging in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 animate-fade-in">
      <Toaster position="top-right" />
      
      {/* Left side - Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/90 via-slate-900/95 to-slate-900 z-10" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10" />
        
        <div className="relative z-20 flex flex-col justify-center px-16 h-full text-white">
          <div className="mb-12 inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <HeartPulse className="h-8 w-8 text-rose-400" />
          </div>
          <h1 className="text-5xl font-outfit font-bold mb-6 leading-tight">
            Advanced Care, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300">Simplified.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-md font-light leading-relaxed">
            Access your secure portal to manage appointments, access medical records, and connect with healthcare professionals.
          </p>
          
          <div className="absolute bottom-16 left-16 flex items-center space-x-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-rose-400" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">Trusted by <span className="text-white font-medium">10,000+</span> patients</p>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
              <HeartPulse className="h-8 w-8" />
            </div>
          </div>
          
          <div className="text-left mb-10">
            <h2 className="text-3xl font-outfit font-bold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-slate-500">Please enter your details to sign in.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm transition-all shadow-sm bg-white/50 focus:bg-white"
                    placeholder="Enter your email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-sm font-medium text-rose-600 hover:text-rose-500 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm transition-all shadow-sm bg-white/50 focus:bg-white"
                    placeholder="Enter your password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="flex items-center">
                    Sign In
                    <LogIn className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-rose-600 hover:text-rose-500 transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;