import { 
  Users, 
  ShieldAlert, 
  DoorOpen, 
  CalendarClock,
  ArrowUpRight,
  Shield,
  TrendingUp,
  AlertCircle,
  Lock
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell as RechartsCell
} from 'recharts';
import { Inmate, Cell, Guard, Incident, Visit, UserAccount } from "../types";

interface DashboardProps {
  inmates: Inmate[];
  cells: Cell[];
  guards: Guard[];
  incidents: Incident[];
  visits: Visit[];
  setCurrentTab: (tab: string) => void;
  currentUser: UserAccount;
}

export default function Dashboard({ inmates, cells, guards, incidents, visits, setCurrentTab, currentUser }: DashboardProps) {
  // Compute Analytics
  const activeInmates = inmates.filter(i => i.status === "Incarcerated");
  const totalInmatesCount = activeInmates.length;
  const releasedInmatesCount = inmates.filter(i => i.status === "Released").length;
  
  // Total cell capacity calculation
  const totalCapacity = cells.reduce((sum, cell) => sum + (cell.status === "Active" ? cell.capacity : 0), 0);
  const totalOccupants = activeInmates.length;
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupants / totalCapacity) * 100) : 0;

  // Active incidents (under investigation)
  const activeIncidents = incidents.filter(inc => inc.status === "Under Investigation");
  
  // Active guards
  const activeGuards = guards.filter(g => g.status === "Active");

  // Helper to verify tab access
  const hasTabAccess = (tabId: string) => {
    switch (currentUser.role) {
      case "Admin":
        return true;
      case "Warden":
        return tabId !== "users";
      case "Guard":
        return ["dashboard", "inmates", "guards", "incidents"].includes(tabId);
      case "Visitor Desk":
        return ["dashboard", "visits"].includes(tabId);
      case "Medical":
        return ["dashboard", "inmates"].includes(tabId);
      default:
        return tabId === "dashboard";
    }
  };

  // Upcoming visits
  const pendingVisits = visits.filter(v => v.status === "Pending" || v.status === "Approved");

  // Chart Data 1: Inmates by Security Level
  const securityCounts = activeInmates.reduce((acc: any, inmate) => {
    acc[inmate.securityLevel] = (acc[inmate.securityLevel] || 0) + 1;
    return acc;
  }, { Minimum: 0, Medium: 0, Maximum: 0 });

  const securityChartData = [
    { name: "Minimum", value: securityCounts.Minimum, color: "#10b981" }, // emerald
    { name: "Medium", value: securityCounts.Medium, color: "#eab308" }, // yellow
    { name: "Maximum", value: securityCounts.Maximum, color: "#ef4444" }, // red
  ];

  // Chart Data 2: Block Occupancy
  const blockData = cells.reduce((acc: any, cell) => {
    const blockName = cell.block;
    if (!acc[blockName]) {
      acc[blockName] = { name: blockName, capacity: 0, current: 0 };
    }
    if (cell.status === "Active") {
      acc[blockName].capacity += cell.capacity;
    }
    acc[blockName].current += cell.currentOccupants.length;
    return acc;
  }, {});

  const blockChartData = Object.values(blockData);

  // Inmates behavior breakdown
  const averageBehavior = Math.round(
    activeInmates.reduce((sum, i) => sum + i.behaviorScore, 0) / (totalInmatesCount || 1)
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Page Title & Time */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Facility Dashboard</h2>
          <p className="text-sm text-slate-500">Real-time supervision and facility metrics overview.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          <CalendarClock className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono font-medium text-slate-600">
            System Local: {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Total Inmates */}
        <div 
          onClick={() => hasTabAccess("inmates") && setCurrentTab("inmates")}
          className={`bg-white p-6 rounded-xl border border-slate-200 shadow-xs transition-all flex flex-col justify-between ${
            hasTabAccess("inmates") 
              ? "hover:border-rose-300 cursor-pointer group" 
              : "opacity-60 cursor-not-allowed"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inmate Census</span>
            <div className={`p-2 rounded-lg text-slate-600 transition-colors ${
              hasTabAccess("inmates") 
                ? "bg-slate-50 group-hover:bg-rose-50 group-hover:text-rose-600" 
                : "bg-slate-100 text-slate-400"
            }`}>
              {hasTabAccess("inmates") ? <Users className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{totalOccupants}</span>
              <span className="text-xs text-slate-400">active</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">{releasedInmatesCount}</span> discharged historically
            </div>
          </div>
        </div>

        {/* Stat 2: Housing Occupancy */}
        <div 
          onClick={() => hasTabAccess("housing") && setCurrentTab("housing")}
          className={`bg-white p-6 rounded-xl border border-slate-200 shadow-xs transition-all flex flex-col justify-between ${
            hasTabAccess("housing") 
              ? "hover:border-amber-300 cursor-pointer group" 
              : "opacity-60 cursor-not-allowed"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Housing Occupancy</span>
            <div className={`p-2 rounded-lg text-slate-600 transition-colors ${
              hasTabAccess("housing") 
                ? "bg-slate-50 group-hover:bg-amber-50 group-hover:text-amber-600" 
                : "bg-slate-100 text-slate-400"
            }`}>
              {hasTabAccess("housing") ? <DoorOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{occupancyRate}%</span>
              <span className="text-xs text-slate-400">capacity</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-mono">
              {totalOccupants} / {totalCapacity} Active Beds Assigned
            </div>
          </div>
        </div>

        {/* Stat 3: Active Guards */}
        <div 
          onClick={() => hasTabAccess("guards") && setCurrentTab("guards")}
          className={`bg-white p-6 rounded-xl border border-slate-200 shadow-xs transition-all flex flex-col justify-between ${
            hasTabAccess("guards") 
              ? "hover:border-blue-300 cursor-pointer group" 
              : "opacity-60 cursor-not-allowed"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Guards Scheduled</span>
            <div className={`p-2 rounded-lg text-slate-600 transition-colors ${
              hasTabAccess("guards") 
                ? "bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600" 
                : "bg-slate-100 text-slate-400"
            }`}>
              {hasTabAccess("guards") ? <Shield className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{activeGuards.length}</span>
              <span className="text-xs text-slate-400">on duty</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              Secure ratio: 1:{(totalOccupants / (activeGuards.length || 1)).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Stat 4: Incidents */}
        <div 
          onClick={() => hasTabAccess("incidents") && setCurrentTab("incidents")}
          className={`bg-white p-6 rounded-xl border border-slate-200 shadow-xs transition-all flex flex-col justify-between ${
            hasTabAccess("incidents") 
              ? "hover:border-red-300 cursor-pointer group" 
              : "opacity-60 cursor-not-allowed"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Inquiries</span>
            <div className={`p-2 rounded-lg text-slate-600 transition-colors ${
              hasTabAccess("incidents") 
                ? "bg-slate-50 group-hover:bg-red-50 group-hover:text-red-600" 
                : "bg-slate-100 text-slate-400"
            }`}>
              {hasTabAccess("incidents") ? <ShieldAlert className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{activeIncidents.length}</span>
              <span className="text-xs text-slate-400 font-medium">open cases</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-red-600 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 animate-pulse" /> High priority: {incidents.filter(i => i.severity === "High").length} logged
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Security Level Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Classification Mix</h3>
            <p className="text-xs text-slate-500">Active census security ratings distribution</p>
          </div>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={securityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {securityChartData.map((entry, index) => (
                    <RechartsCell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '6px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  itemStyle={{ color: '#cbd5e1', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Summary text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900">{totalOccupants}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Inmates</span>
            </div>
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            {securityChartData.map((level) => (
              <div key={level.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: level.color }} />
                  <span className="font-medium text-slate-600">{level.name} Security</span>
                </div>
                <span className="font-mono text-slate-800 font-bold">{level.value} inmates</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Block capacity analysis */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Block Resource Allocation</h3>
              <p className="text-xs text-slate-500">Current active inmates vs maximum cell block capacity</p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 border border-slate-200 rounded text-[11px] font-medium text-slate-600">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> Average Behavior Score: {averageBehavior}/100
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={blockChartData}
                margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '6px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', pt: '10px' }} />
                <Bar dataKey="current" name="Inmates Assigned" fill="#e11d48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" name="Total Capacity Beds" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Bulletins & Pending Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facility Notifications & Announcements */}
        <div className="bg-slate-900 p-6 rounded-xl text-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase">SYS_LOG ACTIVE BULLETINS</h3>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">LIVE SYNC</span>
          </div>
          <div className="space-y-3.5">
            <div className="flex items-start gap-3 text-xs leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-mono font-semibold">[INCIDENT UPDATE]</span> Block B investigation is active. All inmate medication counts must be supervised by Sgt. Jenkins until further order.
              </div>
            </div>
            <div className="flex items-start gap-3 text-xs leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-mono font-semibold">[INFRASTRUCTURE]</span> Cell A-103 is currently undergoing structural lock track alignment. ETA for reactivation is July 14, 18:00.
              </div>
            </div>
            <div className="flex items-start gap-3 text-xs leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-mono font-semibold">[REHABILITATION]</span> Dynamic rehabilitation profiles using server-side Gemini are fully integrated for customized sentence modeling.
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Visitors Overview */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Scheduled Visitation Queue</h3>
              <button 
                onClick={() => setCurrentTab("visits")}
                className="text-xs text-rose-600 font-medium hover:underline flex items-center gap-1"
              >
                Go to registry <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {pendingVisits.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No visit sessions scheduled for today.</p>
            ) : (
              <div className="space-y-3">
                {pendingVisits.slice(0, 3).map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{visit.visitorName} ({visit.relationship})</div>
                      <div className="text-slate-500 mt-0.5">Visiting: <span className="font-medium text-slate-700">{visit.inmateName}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-slate-600">{visit.visitDate}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{visit.startTime} - {visit.endTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
