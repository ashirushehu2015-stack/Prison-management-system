import { 
  Home, 
  Users, 
  Layers, 
  Shield, 
  AlertTriangle, 
  Calendar, 
  Activity,
  LogOut,
  Building2,
  Lock,
  Key
} from "lucide-react";
import { UserAccount } from "../types";
import IconicLogo from "./IconicLogo";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  inmatesCount: number;
  activeIncidentsCount: number;
  currentUser: UserAccount;
  onLogout: () => void;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  inmatesCount, 
  activeIncidentsCount,
  currentUser,
  onLogout
}: SidebarProps) {
  const allMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "inmates", label: "Inmate Directory", icon: Users, badge: inmatesCount },
    { id: "housing", label: "Housing & Cells", icon: Layers },
    { id: "guards", label: "Guard Roster", icon: Shield },
    { id: "incidents", label: "Incident Log", icon: AlertTriangle, badge: activeIncidentsCount, badgeColor: "bg-amber-100 text-amber-800 font-semibold" },
    { id: "visits", label: "Visitor Registry", icon: Calendar },
    { id: "users", label: "User Accounts", icon: Key },
  ];

  // Filter menu items strictly by role
  const menuItems = allMenuItems.filter(item => {
    switch (currentUser.role) {
      case "Admin":
        return true; // Admin sees all
      case "Warden":
        return item.id !== "users"; // Warden sees all except Users
      case "Guard":
        return ["dashboard", "inmates", "guards", "incidents"].includes(item.id);
      case "Visitor Desk":
        return ["dashboard", "visits"].includes(item.id);
      case "Medical":
        return ["dashboard", "inmates"].includes(item.id);
      default:
        return item.id === "dashboard";
    }
  });

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 h-screen sticky top-0 shrink-0 select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/30">
        <IconicLogo variant="trans" showBg={true} className="w-8 h-8 pointer-events-none" />
        <div className="min-w-0">
          <h1 className="font-black text-sm text-white tracking-tight leading-tight uppercase">
            MIT 800
          </h1>
          <p className="font-extrabold text-[11px] text-white tracking-wider uppercase mt-0.5">
            Capstone Project.
          </p>
          <p className="text-[8px] text-slate-400 font-semibold tracking-normal uppercase mt-0.5">
            Iconic University
          </p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-3 mb-2 font-semibold">NAVIGATION</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group text-left cursor-pointer ${
                isActive
                  ? "bg-rose-600/15 text-rose-400 font-medium"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 transition-colors ${
                  isActive ? "text-rose-400" : "text-slate-400 group-hover:text-slate-200"
                }`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor || "bg-slate-800 text-slate-300 font-mono"}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30 space-y-2.5">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-[11px] text-slate-400 font-medium font-mono">
            SECURE LINK ONLINE
          </div>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <img 
              src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"} 
              alt={currentUser.name} 
              className="w-7 h-7 rounded-full object-cover border border-slate-800"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold leading-none">{currentUser.role}</span>
              <span className="text-[11px] text-slate-300 font-semibold truncate max-w-[110px] mt-0.5">{currentUser.name}</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            title="Log Out Session"
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
