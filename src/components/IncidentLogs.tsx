import React, { useState } from "react";
import { 
  AlertTriangle, 
  Plus, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle, 
  FolderOpen,
  X,
  User,
  Shield,
  Search,
  MessageSquare,
  Activity
} from "lucide-react";
import { Incident, Inmate, Guard, UserAccount } from "../types";

interface IncidentLogsProps {
  incidents: Incident[];
  inmates: Inmate[];
  guards: Guard[];
  onAddIncident: (incident: Incident) => void;
  onUpdateIncidentStatus: (incidentId: string, status: "Under Investigation" | "Resolved" | "Closed") => void;
  currentUser: UserAccount;
}

export default function IncidentLogs({ incidents, inmates, guards, onAddIncident, onUpdateIncidentStatus, currentUser }: IncidentLogsProps) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  // Form state
  const [newIncident, setNewIncident] = useState({
    title: "",
    severity: "Medium" as "Low" | "Medium" | "High",
    location: "",
    involvedInmateIds: [] as string[],
    reportingGuardId: "",
    description: "",
    actionsTaken: ""
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.title || !newIncident.description) return;

    const incidentId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    
    const added: Incident = {
      id: incidentId,
      title: newIncident.title,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0].slice(0, 5),
      severity: newIncident.severity,
      location: newIncident.location || "General Facility",
      involvedInmateIds: newIncident.involvedInmateIds,
      reportingGuardId: newIncident.reportingGuardId,
      description: newIncident.description,
      actionsTaken: newIncident.actionsTaken || "Investigating officer assigned.",
      status: "Under Investigation"
    };

    onAddIncident(added);
    setSelectedIncident(added);
    setIsAddModalOpen(false);

    // Reset Form
    setNewIncident({
      title: "",
      severity: "Medium",
      location: "",
      involvedInmateIds: [],
      reportingGuardId: "",
      description: "",
      actionsTaken: ""
    });
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === "High") return "bg-rose-100 text-rose-800 border-rose-200";
    if (severity === "Medium") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-sky-100 text-sky-800 border-sky-200";
  };

  const getStatusBadge = (status: string) => {
    if (status === "Under Investigation") return "bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse";
    if (status === "Resolved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-600 border-slate-300";
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "All" || inc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  // Helper to resolve Inmate names from IDs
  const getInmateNames = (ids: string[]) => {
    if (ids.length === 0) return "None";
    return ids.map(id => {
      const inmate = inmates.find(i => i.id === id);
      return inmate ? `${inmate.name} (${id})` : id;
    }).join(", ");
  };

  // Helper to resolve Guard name from ID
  const getGuardName = (id: string) => {
    const guard = guards.find(g => g.id === id);
    return guard ? `${guard.name} (${guard.rank})` : id;
  };

  const activeInmates = inmates.filter(i => i.status === "Incarcerated");

  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* LEFT COLUMN: Incidents Feed & Searching */}
      <div className="w-full lg:w-5/12 bg-white rounded-xl border border-slate-200 flex flex-col h-full shadow-xs">
        
        {/* Header search block */}
        <div className="p-5 border-b border-slate-100 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight text-lg">Facility Incident Logs</h3>
              <p className="text-xs text-slate-500">{filteredIncidents.length} security events logged</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium px-3.5 py-2 rounded-lg transition-all shadow-sm shadow-rose-900/10 cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" /> File Incident
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by title, INC serial, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>

          {/* Severity Filters */}
          <div className="flex gap-2">
            {["All", "High", "Medium", "Low"].map((level) => (
              <button
                key={level}
                onClick={() => setSeverityFilter(level)}
                className={`px-3 py-1 rounded text-xs font-semibold border cursor-pointer transition-all ${
                  severityFilter === level
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {level === "All" ? "All Severity" : `${level} Severity`}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Feed list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1.5 bg-slate-50/50">
          {filteredIncidents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              No incidents reported matching criteria.
            </div>
          ) : (
            filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-lg flex flex-col justify-between cursor-pointer transition-all space-y-2 border ${
                    isSelected 
                      ? "bg-rose-50/40 border-rose-500 shadow-xs" 
                      : "bg-white border-slate-200/50 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 text-[10px] font-bold">{inc.id}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${getSeverityBadge(inc.severity)}`}>
                      {inc.severity} Priority
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{inc.title}</h4>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inc.location}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{inc.date} • {inc.time}</span>
                    <span className={`font-semibold ${inc.status === 'Resolved' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                      {inc.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Case File Report Details */}
      <div className="w-full lg:w-7/12 bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-y-auto shadow-xs p-6 space-y-6">
        {selectedIncident ? (
          <>
            {/* Header with Title and Status controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-widest">{selectedIncident.id}</span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5 leading-snug">{selectedIncident.title}</h3>
                <div className="flex items-center gap-3.5 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-400" /> {selectedIncident.location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-slate-400" /> {selectedIncident.date} {selectedIncident.time}</span>
                </div>
              </div>

              {/* Status control dropdown */}
              <div className="text-right flex flex-col items-end shrink-0 gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Investigation Status</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 border text-[11px] font-bold rounded-full ${getStatusBadge(selectedIncident.status)}`}>
                    {selectedIncident.status}
                  </span>
                  {["Admin", "Warden"].includes(currentUser.role) && (
                    <select
                      value={selectedIncident.status}
                      onChange={(e) => onUpdateIncidentStatus(selectedIncident.id, e.target.value as any)}
                      className="p-1 bg-white border border-slate-200 rounded text-[11px] font-semibold focus:outline-none"
                    >
                      <option value="Under Investigation">Investigate</option>
                      <option value="Resolved">Resolve</option>
                      <option value="Closed">Close</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Severity and Inquest cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 border border-slate-200 rounded-lg space-y-2.5 bg-white">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Involved Inmates</span>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <p className="text-xs text-slate-700 font-semibold">
                    {getInmateNames(selectedIncident.involvedInmateIds)}
                  </p>
                </div>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg space-y-2.5 bg-white">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reporting Security Officer</span>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <p className="text-xs text-slate-700 font-semibold">
                    {getGuardName(selectedIncident.reportingGuardId)}
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative Box */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" /> Disciplinary Incident Narrative
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-200 font-medium">
                {selectedIncident.description}
              </p>
            </div>

            {/* Actions Taken Box */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" /> Direct Actions Taken & Remediation
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-rose-50/20 p-4 rounded-lg border border-rose-100 font-medium">
                {selectedIncident.actionsTaken}
              </p>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
            <FolderOpen className="w-12 h-12 text-slate-200 mb-2" />
            <p className="text-sm">Select an incident log from feed to examine disciplinary file.</p>
          </div>
        )}
      </div>

      {/* FILE NEW INCIDENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">File Disciplinary Incident</h3>
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
                <label className="block font-bold text-slate-600 mb-1">Incident Title *</label>
                <input
                  type="text"
                  required
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                  placeholder="e.g., Physical Skirmish in Cafeteria"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Severity / Threat Index</label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({...newIncident, severity: e.target.value as any})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Threat</option>
                    <option value="High">High Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={newIncident.location}
                    onChange={(e) => setNewIncident({...newIncident, location: e.target.value})}
                    placeholder="e.g., Yard, Cell B-201"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Involved Inmate (Optional)</label>
                  <select
                    value={newIncident.involvedInmateIds[0] || ""}
                    onChange={(e) => setNewIncident({...newIncident, involvedInmateIds: e.target.value ? [e.target.value] : []})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="">-- None --</option>
                    {activeInmates.map(i => (
                      <option key={i.id} value={i.id}>{i.name} ({i.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Reporting Guard Officer *</label>
                  <select
                    required
                    value={newIncident.reportingGuardId}
                    onChange={(e) => setNewIncident({...newIncident, reportingGuardId: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  >
                    <option value="">-- Choose Guard --</option>
                    {guards.filter(g => g.status === 'Active').map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.rank})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Disciplinary Description & Narrative *</label>
                <textarea
                  required
                  rows={3}
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                  placeholder="Provide precise chronological descriptions of the security disruption, verbal refusal details, or physical escalation factors..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Immediate Actions Taken & Remediations</label>
                <textarea
                  rows={2}
                  value={newIncident.actionsTaken}
                  onChange={(e) => setNewIncident({...newIncident, actionsTaken: e.target.value})}
                  placeholder="Confiscation details, single cell segregation directives, restrictions logged..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 resize-none"
                />
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
                  Log Incident Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
