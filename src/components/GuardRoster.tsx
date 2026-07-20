import React, { useState } from "react";
import { 
  Shield, 
  Plus, 
  Phone, 
  Clock, 
  UserCheck, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  X,
  Sparkles,
  CalendarDays,
  Lock
} from "lucide-react";
import { Guard, UserAccount } from "../types";

interface GuardRosterProps {
  guards: Guard[];
  onAddGuard: (guard: Guard) => void;
  onUpdateGuardStatus: (guardId: string, status: "Active" | "On Leave" | "Suspended") => void;
  currentUser: UserAccount;
}

export default function GuardRoster({ guards, onAddGuard, onUpdateGuardStatus, currentUser }: GuardRosterProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGuard, setNewGuard] = useState({
    name: "",
    badgeNumber: "",
    rank: "Officer" as "Officer" | "Sergeant" | "Lieutenant" | "Captain",
    shift: "Morning" as "Morning" | "Swing" | "Night",
    assignedBlock: "Block A",
    phone: ""
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuard.name || !newGuard.badgeNumber) return;

    const added: Guard = {
      id: `G-${Math.floor(100 + Math.random() * 900)}`,
      name: newGuard.name,
      badgeNumber: `BADGE-${newGuard.badgeNumber.toUpperCase()}`,
      rank: newGuard.rank,
      shift: newGuard.shift,
      assignedBlock: newGuard.assignedBlock,
      status: "Active",
      phone: newGuard.phone || "+1 (555) 000-0000"
    };

    onAddGuard(added);
    setIsAddModalOpen(false);
    setNewGuard({
      name: "",
      badgeNumber: "",
      rank: "Officer",
      shift: "Morning",
      assignedBlock: "Block A",
      phone: ""
    });
  };

  const getRankBadge = (rank: string) => {
    if (rank === "Captain") return "bg-rose-100 text-rose-800 border-rose-200";
    if (rank === "Lieutenant") return "bg-indigo-100 text-indigo-800 border-indigo-200";
    if (rank === "Sergeant") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getStatusBadge = (status: string) => {
    if (status === "Active") return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (status === "On Leave") return "bg-slate-50 text-slate-500 border-slate-200";
    return "bg-rose-50 text-rose-800 border-rose-200";
  };

  // Group guards by shift for shift view
  const shifts = {
    Morning: guards.filter(g => g.shift === "Morning" && g.status === "Active"),
    Swing: guards.filter(g => g.shift === "Swing" && g.status === "Active"),
    Night: guards.filter(g => g.shift === "Night" && g.status === "Active")
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Security Personnel & Shifting</h2>
          <p className="text-sm text-slate-500">Supervise guard registries, active shifts, and duty assignments per block.</p>
        </div>
        {["Admin", "Warden"].includes(currentUser.role) ? (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4.5 h-4.5" /> Enlist Security Guard
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs bg-slate-100 text-slate-400 font-semibold px-4 py-2.5 rounded-lg border border-slate-200 select-none">
            <Lock className="w-4 h-4 text-slate-300" /> Registry Read-Only
          </div>
        )}
      </div>

      {/* Shifts Timeline Board */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-6 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-sm tracking-wide text-white uppercase">Daily Active Shift Schedules</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded">REAL TIME SUPERVISION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Morning Shift */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300 text-xs">Morning Shift (06:00 - 14:00)</span>
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                {shifts.Morning.length} active
              </span>
            </div>
            {shifts.Morning.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No guards scheduled</p>
            ) : (
              <div className="space-y-2">
                {shifts.Morning.map(g => (
                  <div key={g.id} className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{g.name}</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">{g.rank} • Assigned: {g.assignedBlock}</div>
                    </div>
                    <span className="font-mono text-slate-400 text-[9px] bg-slate-800 px-1.5 py-0.5 rounded font-bold">{g.badgeNumber}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swing Shift */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300 text-xs">Swing Shift (14:00 - 22:00)</span>
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                {shifts.Swing.length} active
              </span>
            </div>
            {shifts.Swing.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No guards scheduled</p>
            ) : (
              <div className="space-y-2">
                {shifts.Swing.map(g => (
                  <div key={g.id} className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{g.name}</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">{g.rank} • Assigned: {g.assignedBlock}</div>
                    </div>
                    <span className="font-mono text-slate-400 text-[9px] bg-slate-800 px-1.5 py-0.5 rounded font-bold">{g.badgeNumber}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Night Shift */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300 text-xs">Night Shift (22:00 - 06:00)</span>
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                {shifts.Night.length} active
              </span>
            </div>
            {shifts.Night.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No guards scheduled</p>
            ) : (
              <div className="space-y-2">
                {shifts.Night.map(g => (
                  <div key={g.id} className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{g.name}</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">{g.rank} • Assigned: {g.assignedBlock}</div>
                    </div>
                    <span className="font-mono text-slate-400 text-[9px] bg-slate-800 px-1.5 py-0.5 rounded font-bold">{g.badgeNumber}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personnel List Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-base">Personnel Ledger</h3>
          <p className="text-xs text-slate-500">Full catalog of security officers, including rank tags, shift designations, and quick status controls.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
                <th className="p-4">Guard Details</th>
                <th className="p-4">Rank</th>
                <th className="p-4">Block assignment</th>
                <th className="p-4">Active shift</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-right">Status control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guards.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-700">
                        <Shield className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block text-sm leading-none">{g.name}</span>
                        <span className="font-mono text-slate-400 text-[10px] font-bold block mt-1">{g.id} | {g.badgeNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 border text-[10px] font-semibold rounded ${getRankBadge(g.rank)}`}>
                      {g.rank}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {g.assignedBlock}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {g.shift}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-600 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {g.phone}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <span className={`px-2 py-0.5 border text-[10px] font-semibold rounded-full ${getStatusBadge(g.status)}`}>
                        {g.status}
                      </span>
                      {["Admin", "Warden"].includes(currentUser.role) && (
                        <select
                          value={g.status}
                          onChange={(e) => onUpdateGuardStatus(g.id, e.target.value as any)}
                          className="p-1 bg-slate-100 border border-slate-200 rounded text-[11px] focus:outline-none"
                        >
                          <option value="Active">Active</option>
                          <option value="On Leave">Leave</option>
                          <option value="Suspended">Suspend</option>
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ENLIST GUARD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">Security Officer Enlistment</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newGuard.name}
                  onChange={(e) => setNewGuard({...newGuard, name: e.target.value})}
                  placeholder="Officer Marcus Sterling"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Badge Serial Number *</label>
                  <input
                    type="text"
                    required
                    value={newGuard.badgeNumber}
                    onChange={(e) => setNewGuard({...newGuard, badgeNumber: e.target.value})}
                    placeholder="e.g., 4012"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Rank</label>
                  <select
                    value={newGuard.rank}
                    onChange={(e) => setNewGuard({...newGuard, rank: e.target.value as any})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  >
                    <option value="Officer">Officer</option>
                    <option value="Sergeant">Sergeant</option>
                    <option value="Lieutenant">Lieutenant</option>
                    <option value="Captain">Captain</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Shift Slot</label>
                  <select
                    value={newGuard.shift}
                    onChange={(e) => setNewGuard({...newGuard, shift: e.target.value as any})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  >
                    <option value="Morning">Morning (06:00 - 14:00)</option>
                    <option value="Swing">Swing (14:00 - 22:00)</option>
                    <option value="Night">Night (22:00 - 06:00)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Assigned Cell Block</label>
                  <select
                    value={newGuard.assignedBlock}
                    onChange={(e) => setNewGuard({...newGuard, assignedBlock: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="None">Floating / Patrol</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 012-3456"
                  value={newGuard.phone}
                  onChange={(e) => setNewGuard({...newGuard, phone: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-medium rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded shadow-xs cursor-pointer"
                >
                  Enlist Personnel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
