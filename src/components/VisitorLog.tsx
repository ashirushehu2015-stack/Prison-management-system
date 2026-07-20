import React, { useState } from "react";
import { 
  Calendar, 
  Plus, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  X,
  FileText,
  UserCheck,
  AlertTriangle,
  Lock,
  FileDown
} from "lucide-react";
import { Visit, Inmate, UserAccount } from "../types";

interface VisitorLogProps {
  visits: Visit[];
  inmates: Inmate[];
  onAddVisit: (visit: Visit) => void;
  onUpdateVisitStatus: (visitId: string, status: "Approved" | "Pending" | "Completed" | "Denied") => void;
  currentUser: UserAccount;
}

export default function VisitorLog({ visits, inmates, onAddVisit, onUpdateVisitStatus, currentUser }: VisitorLogProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVisit, setNewVisit] = useState({
    inmateId: "",
    visitorName: "",
    relationship: "Spouse",
    visitDate: "",
    startTime: "",
    endTime: "",
    notes: ""
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisit.inmateId || !newVisit.visitorName || !newVisit.visitDate) return;

    const inmate = inmates.find(i => i.id === newVisit.inmateId);
    if (!inmate) return;

    const added: Visit = {
      id: `V-${Math.floor(100 + Math.random() * 900)}`,
      inmateId: newVisit.inmateId,
      inmateName: inmate.name,
      visitorName: newVisit.visitorName,
      relationship: newVisit.relationship,
      visitDate: newVisit.visitDate,
      startTime: newVisit.startTime || "13:00",
      endTime: newVisit.endTime || "14:00",
      status: "Approved",
      notes: newVisit.notes || "Approved on schedule."
    };

    onAddVisit(added);
    setIsAddModalOpen(false);

    // Reset Form
    setNewVisit({
      inmateId: "",
      visitorName: "",
      relationship: "Spouse",
      visitDate: "",
      startTime: "",
      endTime: "",
      notes: ""
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "Approved") return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (status === "Completed") return "bg-slate-100 text-slate-700 border-slate-200";
    if (status === "Pending") return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-rose-50 text-rose-800 border-rose-200";
  };

  const activeInmates = inmates.filter(i => i.status === "Incarcerated");

  const handleExportVisits = () => {
    let report = `=======================================================================\n`;
    report += `                     ICONIC UNIVERSITY CORRECTIONAL FACILITY\n`;
    report += `                             VISITATION REGISTRY LOG REPORT\n`;
    report += `=======================================================================\n`;
    report += `Generated On: ${new Date().toLocaleString()}\n`;
    report += `Total Scheduled Visitation Sessions: ${visits.length}\n`;
    report += `-----------------------------------------------------------------------\n\n`;

    visits.forEach((v, index) => {
      report += `[VISIT SESS ${index + 1} OF ${visits.length}]\n`;
      report += `Session ID:       ${v.id}\n`;
      report += `Visitor Name:     ${v.visitorName}\n`;
      report += `Relationship:     ${v.relationship}\n`;
      report += `Assigned Inmate:  ${v.inmateName} (${v.inmateId})\n`;
      report += `Scheduled Date:   ${v.visitDate}\n`;
      report += `Time Window:      ${v.startTime} - ${v.endTime}\n`;
      report += `Gate Status:      ${v.status.toUpperCase()}\n`;
      report += `-----------------------------------------------------------------------\n`;
      report += `DOSSIER NOTES:\n${v.notes || "No extra medical/security clearance notes listed."}\n`;
      report += `=======================================================================\n\n`;
    });

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visitation_registry_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Visitation Registry & Control</h2>
          <p className="text-sm text-slate-500">Log, screen, and schedule upcoming personal or legal family visits.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportVisits}
            className="flex items-center gap-1.5 text-xs border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer shadow-3xs"
            title="Export visitation log registry to a structured text file"
          >
            <FileDown className="w-4 h-4 text-slate-500" /> Export Registry
          </button>
          {["Admin", "Warden", "Visitor Desk"].includes(currentUser.role) ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4.5 h-4.5" /> Book Visitation Session
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs bg-slate-100 text-slate-400 font-semibold px-4 py-2.5 rounded-lg border border-slate-200 select-none">
              <Lock className="w-4 h-4 text-slate-300" /> Registry Read-Only
            </div>
          )}
        </div>
      </div>

      {/* Roster Table of sessions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-base">Visitation Schedules</h3>
          <p className="text-xs text-slate-500">Real-time schedule listing guest name credentials, relationships, scheduled times, and checkpoints.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
                <th className="p-4">Visitor details</th>
                <th className="p-4">Assigned Inmate</th>
                <th className="p-4">Scheduled Date</th>
                <th className="p-4">Time window</th>
                <th className="p-4">Dossier Notes</th>
                <th className="p-4 text-right">Gate Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visits.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-700">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block text-sm leading-none">{v.visitorName}</span>
                        <span className="text-[10px] text-slate-400 block mt-1 font-semibold uppercase tracking-wider">{v.relationship}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="font-semibold text-slate-800 text-sm block leading-none">{v.inmateName}</span>
                      <span className="font-mono text-slate-400 text-[10px] block mt-1 font-bold">{v.inmateId}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-mono font-medium">
                    {v.visitDate}
                  </td>
                  <td className="p-4 text-slate-600 font-mono font-bold">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {v.startTime} - {v.endTime}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 italic max-w-xs truncate">
                    {v.notes || "No special supervision instructions."}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <span className={`px-2 py-0.5 border text-[10px] font-semibold rounded-full ${getStatusBadge(v.status)}`}>
                        {v.status}
                      </span>
                      {["Admin", "Warden", "Visitor Desk"].includes(currentUser.role) && (
                        <select
                          value={v.status}
                          onChange={(e) => onUpdateVisitStatus(v.id, e.target.value as any)}
                          className="p-1 bg-slate-100 border border-slate-200 rounded text-[11px] focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approve</option>
                          <option value="Completed">Complete</option>
                          <option value="Denied">Deny</option>
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

      {/* VISITATION BOOKING MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">Schedule Visitation Pass</h3>
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
              
              {/* Inmate select */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Select Incarcerated Inmate *</label>
                <select
                  required
                  value={newVisit.inmateId}
                  onChange={(e) => setNewVisit({...newVisit, inmateId: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                >
                  <option value="">-- Choose Inmate --</option>
                  {activeInmates.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.id})</option>
                  ))}
                </select>
              </div>

              {/* Guest name */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  value={newVisit.visitorName}
                  onChange={(e) => setNewVisit({...newVisit, visitorName: e.target.value})}
                  placeholder="Elena Sterling"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                />
              </div>

              {/* Relationship select */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Relationship to Inmate</label>
                <select
                  value={newVisit.relationship}
                  onChange={(e) => setNewVisit({...newVisit, relationship: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                >
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Son">Child / Daughter / Son</option>
                  <option value="Attorney">Attorney / Legal Advisor</option>
                  <option value="Social Worker">Social Case Worker</option>
                  <option value="Friend">Personal Friend</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Schedule Date *</label>
                <input
                  type="date"
                  required
                  value={newVisit.visitDate}
                  onChange={(e) => setNewVisit({...newVisit, visitDate: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                />
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Start Time (24h format)</label>
                  <input
                    type="time"
                    value={newVisit.startTime}
                    onChange={(e) => setNewVisit({...newVisit, startTime: e.target.value})}
                    placeholder="10:00"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">End Time (24h format)</label>
                  <input
                    type="time"
                    value={newVisit.endTime}
                    onChange={(e) => setNewVisit({...newVisit, endTime: e.target.value})}
                    placeholder="11:30"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Special Checkpoint / Screening Notes</label>
                <textarea
                  rows={2}
                  value={newVisit.notes}
                  onChange={(e) => setNewVisit({...newVisit, notes: e.target.value})}
                  placeholder="e.g., Legal brief review required, special access clearances..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none resize-none"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 text-slate-500 leading-normal flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>Screen guest identity card at front checkpoint prior to unlocking central gate vestibule.</span>
              </div>

              {/* Footer */}
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
                  Confirm Booking Pass
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
