import React, { useState } from "react";
import { Lock, Shield, Mail, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck, Key } from "lucide-react";
import { UserAccount } from "../types";
import IconicLogo from "./IconicLogo";

interface LoginProps {
  users: UserAccount[];
  onLogin: (user: UserAccount) => void;
}

export default function Login({ users, onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedUserForPass, setSelectedUserForPass] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please provide username and security passkey credentials.");
      return;
    }

    const foundUser = users.find(
      u => u.username.toLowerCase() === username.toLowerCase().trim()
    );

    if (!foundUser) {
      setError("No registered operator matching that username found in the system ledgers.");
      return;
    }

    if (foundUser.status === "Suspended") {
      setError("This operator clearance has been revoked or suspended by Admin command.");
      return;
    }

    if (foundUser.password && foundUser.password !== password) {
      setError("Security credentials mismatch. Please verify passkey and try again.");
      return;
    }

    // Update active user last active
    foundUser.lastActive = "Just now";
    onLogin(foundUser);
  };

  const handleQuickLogin = (user: UserAccount) => {
    if (user.status === "Suspended") {
      setError("This operator clearance has been revoked or suspended by Admin command.");
      return;
    }
    setUsername(user.username);
    setPassword(user.password || "");
    setSelectedUserForPass(user.id);
    setError("");
  };

  return (
    <div id="login-screen" className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 font-sans overflow-x-hidden bg-white">
      
      {/* LEFT SIDE: Deep Navy Blue Brand Panel */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-[#0B2545] overflow-hidden p-12">
        {/* Background Radial Glow Accents */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#1e40af]/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0a1128]/40 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Transparent Outer Frame Circle */}
        <div className="relative w-full max-w-[500px] aspect-square rounded-full border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center p-8 text-center backdrop-blur-[1px] animate-fade-in shadow-inner">
          
          {/* Padlock Icon Container */}
          <div className="w-16 h-16 bg-[#133C70] rounded-2xl mb-6 shadow-xl border border-white/10 flex items-center justify-center text-white transform hover:rotate-6 transition-transform duration-300">
            <Lock className="w-8 h-8" />
          </div>

          {/* System Title */}
          <div className="space-y-1 mb-4 select-none">
            <h1 className="text-5xl font-black tracking-tight text-white uppercase leading-none">
              MIT 800
            </h1>
            <h2 className="text-2xl font-extrabold text-white tracking-wide uppercase">
              Capstone Project.
            </h2>
            <p className="text-[10px] font-bold text-rose-400 tracking-widest uppercase mt-2">
              Prison Management System
            </p>
          </div>

          {/* Slogan Description */}
          <p className="text-blue-100/85 text-xs font-medium leading-relaxed max-w-[340px] mb-8 font-sans">
            Secure, role-based custody logging, housing allocations, incident logs, and visitor registries for Iconic University Capstone Facilities.
          </p>

          {/* Functional Badges Flow */}
          <div className="flex flex-wrap justify-center gap-2 max-w-[400px]">
            <span className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all">
              Inmate Registry
            </span>
            <span className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all">
              Cell Allocation
            </span>
            <span className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all">
              Guard Schedules
            </span>
            <span className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all">
              Incident Logs
            </span>
            <span className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all">
              Visitor Registry
            </span>
          </div>

        </div>

        {/* Small floating tag */}
        <div className="absolute bottom-6 text-[10px] font-mono text-rose-400/80 uppercase tracking-widest">
          MIT 800 • SECURED OPERATIONAL NETWORK
        </div>
      </div>

      {/* RIGHT SIDE: Elegant White Sign-In Panel */}
      <div className="flex flex-col justify-between p-6 sm:p-12 md:p-16 bg-white w-full min-h-screen">
        
        {/* Mobile/Tablet Header Banner (Visible when left panel is hidden) */}
        <div className="lg:hidden w-full bg-[#0B2545] text-white p-4.5 rounded-2xl mb-4 text-center select-none shadow-md">
          <h1 className="font-black text-2xl tracking-tight leading-none uppercase">
            MIT 800
          </h1>
          <p className="font-extrabold text-xs text-white tracking-wider uppercase mt-1.5">
            Capstone Project.
          </p>
          <p className="text-[8px] text-rose-400 font-bold tracking-widest uppercase mt-1">
            Prison Management System
          </p>
        </div>

        {/* Top University Brand Header */}
        <div className="flex flex-col items-center text-center select-none space-y-2">
          <IconicLogo variant="trans" showBg={true} className="w-8 h-8" />
          <div>
            <h1 className="font-extrabold text-[11px] leading-none tracking-widest text-slate-900 uppercase">
              Iconic University
            </h1>
            <p className="text-[9px] text-rose-500 font-bold tracking-wider uppercase mt-0.5">
              Open & Distance Learning
            </p>
          </div>
        </div>

        {/* Login Form Center Container */}
        <div className="my-auto py-8 max-w-md w-full mx-auto space-y-6">
          
          <div className="space-y-1.5 text-center">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm">
              Sign in to access the MIT 800 PMS portal
            </p>
          </div>

          {/* System Messages / Error Display */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex flex-col items-center text-center gap-2 animate-head-shake">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div className="space-y-0.5">
                <span className="font-bold uppercase tracking-wider text-[10px] text-rose-700 block">Clearance Error</span>
                <span className="leading-relaxed block">{error}</span>
              </div>
            </div>
          )}

          {/* Core Access Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Operator Username input field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
                Operator Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., admin"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545]/10 focus:border-[#0B2545] transition-all font-mono"
                />
              </div>
            </div>

            {/* Secure Passkey input field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545]/10 focus:border-[#0B2545] transition-all font-mono pr-12"
                />
                
                {/* Reveal password button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#0B2545] hover:bg-[#071931] text-white font-bold rounded-xl text-xs tracking-wider uppercase shadow-md shadow-blue-950/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Quick Demo Access Badges (Beautifully styled) */}
          <div className="space-y-2 pt-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center">
                Demo Operator Quick Access
              </span>
              <span className="text-[8px] font-mono bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-center">
                Proto Bypass
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {users.map((u) => {
                const isSelected = selectedUserForPass === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/60 border-[#0B2545] text-[#0B2545]"
                        : "bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <img
                      src={u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"}
                      alt={u.name}
                      className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-[9px] leading-none truncate">{u.name.split(" ")[0]}</div>
                      <div className="text-[8px] font-mono text-slate-400 tracking-tight uppercase">{u.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Authorized Warning Box (as in screenshot) */}
          <div className="p-4 bg-blue-50/45 border border-blue-100/70 rounded-xl text-blue-950 text-xs flex flex-col items-center text-center gap-2 shadow-sm">
            <ShieldCheck className="text-[#0B2545] w-5 h-5 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-blue-950 font-medium leading-relaxed text-[11px]">
                This system is for authorised PMS personnel only. Unauthorised access attempts are logged and may be prosecuted.
              </p>
            </div>
          </div>

        </div>

        {/* Footer info (matching bottom of screenshot) */}
        <div className="flex flex-col items-center justify-center pt-6 border-t border-slate-100 text-[11px] gap-2">
          <span className="text-slate-400 font-medium text-center">
            For access issues, contact your PMS System Administrator.
          </span>
          <button 
            type="button"
            onClick={() => alert("Please consult your warden supervisor to reset security ledger key cards.")}
            className="font-bold text-[#0B2545] hover:text-rose-600 hover:underline cursor-pointer transition-colors"
          >
            Forgot password?
          </button>
        </div>

      </div>

    </div>
  );
}
