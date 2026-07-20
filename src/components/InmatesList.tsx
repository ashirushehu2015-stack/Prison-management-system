import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  UserPlus, 
  ShieldAlert, 
  Activity, 
  BookOpen, 
  FileText, 
  Calendar, 
  BrainCircuit, 
  Sparkles,
  Loader2,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  User,
  X,
  FileDown,
  Edit,
  Lock
} from "lucide-react";
import { Inmate, AIRehabPlan, SecurityLevel, InmateStatus, UserAccount } from "../types";

interface InmatesListProps {
  inmates: Inmate[];
  onAddInmate: (inmate: Inmate) => void;
  onUpdateInmate: (inmate: Inmate) => void;
  cellOptions: string[];
  currentUser: UserAccount;
}

export default function InmatesList({ inmates, onAddInmate, onUpdateInmate, cellOptions, currentUser }: InmatesListProps) {
  const [selectedInmate, setSelectedInmate] = useState<Inmate | null>(inmates[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [securityFilter, setSecurityFilter] = useState<string>("All");
  const [blockFilter, setBlockFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("Incarcerated");

  // Add Inmate Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInmate, setNewInmate] = useState({
    name: "",
    dateOfBirth: "",
    securityLevel: "Medium" as SecurityLevel,
    cellBlock: "Block A",
    cellNumber: "101",
    offenses: "",
    admissionDate: new Date().toISOString().split("T")[0],
    releaseDate: "",
    medicalNotes: "",
    behaviorScore: 80,
    caseNotes: ""
  });

  // Edit Inmate Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editInmateForm, setEditInmateForm] = useState({
    id: "",
    name: "",
    dateOfBirth: "",
    securityLevel: "Medium" as SecurityLevel,
    cellBlock: "Block A",
    cellNumber: "101",
    status: "Incarcerated" as InmateStatus,
    offenses: "",
    admissionDate: "",
    releaseDate: "",
    medicalNotes: "",
    behaviorScore: 80,
    caseNotes: ""
  });

  const handleEditClick = (inmate: Inmate) => {
    setEditInmateForm({
      id: inmate.id,
      name: inmate.name,
      dateOfBirth: inmate.dateOfBirth,
      securityLevel: inmate.securityLevel,
      cellBlock: inmate.cellBlock,
      cellNumber: inmate.cellNumber,
      status: inmate.status,
      offenses: inmate.offenses.join(", "),
      admissionDate: inmate.admissionDate,
      releaseDate: inmate.releaseDate || "",
      medicalNotes: inmate.medicalNotes || "",
      behaviorScore: inmate.behaviorScore,
      caseNotes: inmate.caseNotes || ""
    });
    setIsEditModalOpen(true);
  };

  const handleEditInmateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInmate) return;

    let updated: Inmate;
    if (currentUser.role === "Admin" || currentUser.role === "Warden") {
      updated = {
        ...selectedInmate,
        name: editInmateForm.name.trim(),
        dateOfBirth: editInmateForm.dateOfBirth,
        securityLevel: editInmateForm.securityLevel,
        cellBlock: editInmateForm.cellBlock,
        cellNumber: editInmateForm.cellNumber,
        status: editInmateForm.status,
        offenses: editInmateForm.offenses.split(",").map(o => o.trim()).filter(Boolean),
        admissionDate: editInmateForm.admissionDate,
        releaseDate: editInmateForm.releaseDate,
        medicalNotes: editInmateForm.medicalNotes,
        behaviorScore: Number(editInmateForm.behaviorScore),
        caseNotes: editInmateForm.caseNotes
      };
    } else {
      // Medical can only update health/case notes and behavior score
      updated = {
        ...selectedInmate,
        behaviorScore: Number(editInmateForm.behaviorScore),
        medicalNotes: editInmateForm.medicalNotes,
        caseNotes: editInmateForm.caseNotes
      };
    }

    onUpdateInmate(updated);
    setSelectedInmate(updated);
    setIsEditModalOpen(false);
  };

  // AI Rehab Plan states
  const [aiPlans, setAiPlans] = useState<Record<string, AIRehabPlan>>({});
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Filtering
  const filteredInmates = inmates.filter((inmate) => {
    const matchesSearch = inmate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inmate.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSecurity = securityFilter === "All" || inmate.securityLevel === securityFilter;
    const matchesBlock = blockFilter === "All" || inmate.cellBlock === blockFilter;
    const matchesStatus = statusFilter === "All" || inmate.status === statusFilter;

    return matchesSearch && matchesSecurity && matchesBlock && matchesStatus;
  });

  const handleAddInmateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInmate.name || !newInmate.admissionDate) return;

    const inmateId = `IN-${Math.floor(1000 + Math.random() * 9000)}`;
    const added: Inmate = {
      id: inmateId,
      name: newInmate.name,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop", // placeholder
      dateOfBirth: newInmate.dateOfBirth,
      securityLevel: newInmate.securityLevel,
      cellBlock: newInmate.cellBlock,
      cellNumber: newInmate.cellNumber,
      status: "Incarcerated",
      offenses: newInmate.offenses.split(",").map(o => o.trim()).filter(Boolean),
      admissionDate: newInmate.admissionDate,
      releaseDate: newInmate.releaseDate,
      medicalNotes: newInmate.medicalNotes,
      behaviorScore: Number(newInmate.behaviorScore),
      caseNotes: newInmate.caseNotes
    };

    onAddInmate(added);
    setSelectedInmate(added);
    setIsAddModalOpen(false);
    
    // Reset form
    setNewInmate({
      name: "",
      dateOfBirth: "",
      securityLevel: "Medium",
      cellBlock: "Block A",
      cellNumber: "101",
      offenses: "",
      admissionDate: "",
      releaseDate: "",
      medicalNotes: "",
      behaviorScore: 80,
      caseNotes: ""
    });
  };

  const generateAIRehabPlan = async (inmate: Inmate) => {
    setIsGeneratingPlan(true);
    setGenerationError(null);
    try {
      const response = await fetch("/api/rehab-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inmate.name,
          offenses: inmate.offenses,
          behaviorScore: inmate.behaviorScore,
          caseNotes: inmate.caseNotes,
          securityLevel: inmate.securityLevel
        })
      });

      if (!response.ok) {
        throw new Error("Server failed to generate the rehabilitation plan.");
      }

      const plan: AIRehabPlan = await response.json();
      setAiPlans(prev => ({ ...prev, [inmate.id]: plan }));
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "An error occurred during generative rehabilitation modeling.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const getRecidivismBadge = (risk: string) => {
    if (risk === "High") return "bg-rose-100 text-rose-800 border-rose-200";
    if (risk === "Medium") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* LEFT COLUMN: Inmate Search & List */}
      <div className="w-full lg:w-5/12 bg-white rounded-xl border border-slate-200 flex flex-col h-full shadow-xs">
        
        {/* Search header & Add inmate button */}
        <div className="p-5 border-b border-slate-100 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight text-lg">Inmate Registry</h3>
              <p className="text-xs text-slate-500">{filteredInmates.length} matches found</p>
            </div>
            {(currentUser.role === "Admin" || currentUser.role === "Warden") && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium px-3.5 py-2 rounded-lg transition-all shadow-sm shadow-rose-900/10 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Add Inmate
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name or serial ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Incarcerated">Incarcerated</option>
                <option value="Released">Released</option>
              </select>
            </div>

            {/* Security Level */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Security</label>
              <select
                value={securityFilter}
                onChange={(e) => setSecurityFilter(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium"
              >
                <option value="All">All Levels</option>
                <option value="Minimum">Minimum</option>
                <option value="Medium">Medium</option>
                <option value="Maximum">Maximum</option>
              </select>
            </div>

            {/* Cell Block */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Block</label>
              <select
                value={blockFilter}
                onChange={(e) => setBlockFilter(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium"
              >
                <option value="All">All Blocks</option>
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inmates Scroll Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1 bg-slate-50/50">
          {filteredInmates.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              No matches found in database.
            </div>
          ) : (
            filteredInmates.map((inmate) => {
              const isSelected = selectedInmate?.id === inmate.id;
              return (
                <div
                  key={inmate.id}
                  onClick={() => setSelectedInmate(inmate)}
                  className={`p-3.5 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? "bg-rose-50 border-l-4 border-l-rose-600 shadow-xs border border-slate-200" 
                      : "bg-white hover:bg-slate-50 border border-slate-200/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={inmate.avatarUrl}
                      alt={inmate.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm leading-tight">{inmate.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{inmate.id}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold border ${
                          inmate.securityLevel === "Maximum" 
                            ? "bg-rose-100 text-rose-800 border-rose-200" 
                            : inmate.securityLevel === "Medium"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}>
                          {inmate.securityLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {inmate.cellBlock} - {inmate.cellNumber}
                    </span>
                    <span className={`text-[10px] font-semibold mt-1.5 ${
                      inmate.status === "Incarcerated" ? "text-emerald-600" : "text-slate-400"
                    }`}>
                      {inmate.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Profile Details & AI Rehabilative Modeling */}
      <div className="w-full lg:w-7/12 bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-y-auto shadow-xs p-6 space-y-6">
        {selectedInmate ? (
          <>
            {/* Upper Profile Cover Panel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={selectedInmate.avatarUrl}
                  alt={selectedInmate.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white ring-2 ring-rose-600/20"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{selectedInmate.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                    <span className="font-mono text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold">{selectedInmate.id}</span>
                    <span>•</span>
                    <span>DOB: {selectedInmate.dateOfBirth}</span>
                    <span>•</span>
                    <span className={`font-semibold ${selectedInmate.status === 'Incarcerated' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {selectedInmate.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Behavior Score indicator */}
              <div className="text-right flex flex-col items-end shrink-0">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Behavior Index</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-2xl font-extrabold ${
                    selectedInmate.behaviorScore >= 80 ? "text-emerald-600" : selectedInmate.behaviorScore >= 50 ? "text-amber-500" : "text-rose-600"
                  }`}>
                    {selectedInmate.behaviorScore}
                  </span>
                  <span className="text-xs text-slate-400">/100</span>
                </div>
                <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      selectedInmate.behaviorScore >= 80 ? "bg-emerald-500" : selectedInmate.behaviorScore >= 50 ? "bg-amber-400" : "bg-rose-500"
                    }`}
                    style={{ width: `${selectedInmate.behaviorScore}%` }}
                  />
                </div>
                <div className="mt-2.5">
                  {["Admin", "Warden", "Medical"].includes(currentUser.role) ? (
                    <button
                      onClick={() => handleEditClick(selectedInmate)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-3xs cursor-pointer transition-colors"
                    >
                      <Edit className="w-3 h-3 text-rose-500" /> Edit Dossier
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50">
                      <Lock className="w-2.5 h-2.5 text-slate-300" /> Read-Only
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Core Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Box 1: Admission & Offenses */}
              <div className="p-4 border border-slate-200 rounded-lg space-y-3 bg-white">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Administrative details
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Admission Date</span>
                    <span className="font-semibold text-slate-700">{selectedInmate.admissionDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Release Date</span>
                    <span className="font-semibold text-slate-700">{selectedInmate.releaseDate || "Indefinite"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Cell Assignment</span>
                    <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      {selectedInmate.cellBlock} Cell {selectedInmate.cellNumber}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Logged Offenses</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedInmate.offenses.map((offense, index) => (
                      <span key={index} className="text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded">
                        {offense}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box 2: Health & Case Files */}
              <div className="p-4 border border-slate-200 rounded-lg space-y-3 bg-white flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" /> Medical & Health Profile
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2">
                    {selectedInmate.medicalNotes || "No current medical restrictions listed."}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Case Log Overview</span>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {selectedInmate.caseNotes || "No recent social worker or evaluation logs recorded."}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Rehabilitation Assessor Card */}
            <div className="border border-indigo-200 bg-indigo-50/40 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-indigo-600 text-white rounded">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-none flex items-center gap-1.5">
                      Gemini Cognitive Rehab Assessor <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Customized behavioral counseling and risk reports modeled via Google AI.</p>
                  </div>
                </div>
                {aiPlans[selectedInmate.id] && ["Admin", "Warden", "Medical"].includes(currentUser.role) && (
                  <button 
                    onClick={() => generateAIRehabPlan(selectedInmate)}
                    disabled={isGeneratingPlan}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50 cursor-pointer"
                  >
                    Regenerate profile
                  </button>
                )}
              </div>

              {/* Loader */}
              {isGeneratingPlan && (
                <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-wider animate-pulse">Running advanced Cognitive Rehabilitation Evaluation...</div>
                </div>
              )}

              {/* Error */}
              {generationError && (
                <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Evaluation Failed:</span> {generationError}
                  </div>
                </div>
              )}

              {/* Result Block */}
              {!isGeneratingPlan && !generationError && aiPlans[selectedInmate.id] && (
                <div className="space-y-4 text-xs animate-fade-in">
                  
                  {/* Risks Header */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className={`p-3 rounded-lg border flex flex-col justify-between ${getRecidivismBadge(aiPlans[selectedInmate.id].riskAssessment.recidivismRisk)}`}>
                      <span className="font-bold uppercase text-[9px] tracking-wider opacity-75">Recidivism Risk</span>
                      <span className="text-sm font-extrabold mt-1">{aiPlans[selectedInmate.id].riskAssessment.recidivismRisk}</span>
                    </div>
                    <div className={`p-3 rounded-lg border flex flex-col justify-between ${getRecidivismBadge(aiPlans[selectedInmate.id].riskAssessment.escapeRisk)}`}>
                      <span className="font-bold uppercase text-[9px] tracking-wider opacity-75">Escape Risk</span>
                      <span className="text-sm font-extrabold mt-1">{aiPlans[selectedInmate.id].riskAssessment.escapeRisk}</span>
                    </div>
                    <div className={`p-3 rounded-lg border flex flex-col justify-between ${getRecidivismBadge(aiPlans[selectedInmate.id].riskAssessment.violenceRisk)}`}>
                      <span className="font-bold uppercase text-[9px] tracking-wider opacity-75">Violence Risk</span>
                      <span className="text-sm font-extrabold mt-1">{aiPlans[selectedInmate.id].riskAssessment.violenceRisk}</span>
                    </div>
                  </div>

                  {/* Justification Box */}
                  <div className="p-3 bg-white border border-indigo-100 rounded-lg text-slate-700 leading-relaxed">
                    <span className="block font-bold text-slate-800 uppercase tracking-wider text-[9px] mb-1">Clinical Justification</span>
                    {aiPlans[selectedInmate.id].riskAssessment.justification}
                  </div>

                  {/* Program Proposals */}
                  <div className="space-y-2">
                    <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-2">Recommended Programs</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {aiPlans[selectedInmate.id].recommendedPrograms.map((prog, index) => (
                        <div key={index} className="p-3.5 bg-white border border-slate-200 rounded-lg flex flex-col justify-between">
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{prog.name}</span>
                            <span className="text-slate-500 block text-[11px] mt-1 leading-normal">{prog.description}</span>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Freq: {prog.frequency}</span>
                            <span className="text-indigo-600 font-semibold">{prog.goal}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Goals & Release Prep */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-indigo-100">
                    <div className="space-y-1.5">
                      <span className="block font-bold text-slate-500 uppercase tracking-wider text-[9px]">Target behavioral Milestones</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600 leading-normal">
                        {aiPlans[selectedInmate.id].behavioralGoals.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1.5">
                      <span className="block font-bold text-slate-500 uppercase tracking-wider text-[9px]">Housing & Release Strategy</span>
                      <p className="text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-800">Housing:</span> {aiPlans[selectedInmate.id].housingRecommendation}
                      </p>
                      <p className="text-slate-600 leading-relaxed pt-1">
                        <span className="font-semibold text-slate-800">Post-Release Prep:</span> {aiPlans[selectedInmate.id].releasePreparation}
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* CTA to Generate */}
              {!isGeneratingPlan && !aiPlans[selectedInmate.id] && (
                <div className="p-4 bg-white border border-indigo-100 rounded-xl text-center space-y-3">
                  <p className="text-xs text-slate-600">
                    Analyze {selectedInmate.name}'s rehabilitation trajectory, crime patterns, and disciplinary ledger using Generative AI.
                  </p>
                  {["Admin", "Warden", "Medical"].includes(currentUser.role) ? (
                    <button
                      onClick={() => generateAIRehabPlan(selectedInmate)}
                      className="inline-flex items-center gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Assess cognitive rehabilitation plan
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200/60 px-3.5 py-2 rounded-lg font-semibold select-none">
                      <Lock className="w-3.5 h-3.5 text-slate-300" /> Requires Administrative/Medical Clearance
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Inmate Log Case History Area */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Full Case History</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200/60 font-medium">
                {selectedInmate.caseNotes || "No active casework has been compiled for this correctional subject. Maintain standard observational surveillance."}
              </p>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
            <HelpCircle className="w-12 h-12 text-slate-200 mb-2" />
            <p className="text-sm">Select an inmate from the directory to review dossier.</p>
          </div>
        )}
      </div>

      {/* ADD INMATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">New Inmate Admission</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddInmateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              
              {/* Demographics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newInmate.name}
                    onChange={(e) => setNewInmate({...newInmate, name: e.target.value})}
                    placeholder="Marcus Vance"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={newInmate.dateOfBirth}
                    onChange={(e) => setNewInmate({...newInmate, dateOfBirth: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Classification & Housing */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Security Level</label>
                  <select
                    value={newInmate.securityLevel}
                    onChange={(e) => setNewInmate({...newInmate, securityLevel: e.target.value as SecurityLevel})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  >
                    <option value="Minimum">Minimum</option>
                    <option value="Medium">Medium</option>
                    <option value="Maximum">Maximum</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Cell Block</label>
                  <select
                    value={newInmate.cellBlock}
                    onChange={(e) => setNewInmate({...newInmate, cellBlock: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Cell Number</label>
                  <input
                    type="text"
                    placeholder="101"
                    value={newInmate.cellNumber}
                    onChange={(e) => setNewInmate({...newInmate, cellNumber: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Sentences */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Admission Date *</label>
                  <input
                    type="date"
                    required
                    value={newInmate.admissionDate}
                    onChange={(e) => setNewInmate({...newInmate, admissionDate: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Release Date</label>
                  <input
                    type="date"
                    value={newInmate.releaseDate}
                    onChange={(e) => setNewInmate({...newInmate, releaseDate: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Offenses */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Logged Offenses (comma-separated) *</label>
                <input
                  type="text"
                  placeholder="Grand Theft Auto, Possession of Stolen Goods"
                  value={newInmate.offenses}
                  onChange={(e) => setNewInmate({...newInmate, offenses: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Behavior initial */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Initial Behavior Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newInmate.behaviorScore}
                  onChange={(e) => setNewInmate({...newInmate, behaviorScore: Number(e.target.value)})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Medical notes */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Medical Notes & Health Alerts</label>
                <textarea
                  rows={2}
                  placeholder="Allergies, chronic conditions, daily prescriptions..."
                  value={newInmate.medicalNotes}
                  onChange={(e) => setNewInmate({...newInmate, medicalNotes: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              {/* Case Notes */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Initial Case Evaluation Notes</label>
                <textarea
                  rows={3}
                  placeholder="Social context, cooperative rating, psychological evaluation overview..."
                  value={newInmate.caseNotes}
                  onChange={(e) => setNewInmate({...newInmate, caseNotes: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              {/* Form Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-medium rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded transition-colors shadow-xs cursor-pointer"
                >
                  Log Admission Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT INMATE DOSSIER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">Edit Dossier: {editInmateForm.name}</h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditInmateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              
              {/* Demographics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    disabled={currentUser.role === "Medical"}
                    value={editInmateForm.name}
                    onChange={(e) => setEditInmateForm({...editInmateForm, name: e.target.value})}
                    placeholder="Marcus Vance"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    disabled={currentUser.role === "Medical"}
                    value={editInmateForm.dateOfBirth}
                    onChange={(e) => setEditInmateForm({...editInmateForm, dateOfBirth: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Classification & Housing */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Security Level</label>
                  <select
                    disabled={currentUser.role === "Medical"}
                    value={editInmateForm.securityLevel}
                    onChange={(e) => setEditInmateForm({...editInmateForm, securityLevel: e.target.value as SecurityLevel})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="Minimum">Minimum</option>
                    <option value="Medium">Medium</option>
                    <option value="Maximum">Maximum</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Cell Block</label>
                  <select
                    disabled={currentUser.role === "Medical"}
                    value={editInmateForm.cellBlock}
                    onChange={(e) => setEditInmateForm({...editInmateForm, cellBlock: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Cell Number</label>
                  <input
                    type="text"
                    disabled={currentUser.role === "Medical"}
                    placeholder="101"
                    value={editInmateForm.cellNumber}
                    onChange={(e) => setEditInmateForm({...editInmateForm, cellNumber: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Status and dates */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Custody Status</label>
                  <select
                    disabled={currentUser.role === "Medical"}
                    value={editInmateForm.status}
                    onChange={(e) => setEditInmateForm({...editInmateForm, status: e.target.value as InmateStatus})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="Incarcerated">Incarcerated</option>
                    <option value="Released">Released</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Admission Date</label>
                  <input
                    type="date"
                    disabled={currentUser.role === "Medical"}
                    value={editInmateForm.admissionDate}
                    onChange={(e) => setEditInmateForm({...editInmateForm, admissionDate: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Release Date</label>
                  <input
                    type="date"
                    disabled={currentUser.role === "Medical"}
                    value={editInmateForm.releaseDate}
                    onChange={(e) => setEditInmateForm({...editInmateForm, releaseDate: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Offenses */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Logged Offenses (comma-separated)</label>
                <input
                  type="text"
                  disabled={currentUser.role === "Medical"}
                  placeholder="Grand Theft Auto, Possession of Stolen Goods"
                  value={editInmateForm.offenses}
                  onChange={(e) => setEditInmateForm({...editInmateForm, offenses: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* Behavior Score and Medical */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-slate-600 mb-1">Behavior Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editInmateForm.behaviorScore}
                    onChange={(e) => setEditInmateForm({...editInmateForm, behaviorScore: Number(e.target.value)})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-5">
                    {currentUser.role === "Medical" ? "⚡ MEDICAL ACCESS LEVEL" : "⚡ ADMIN ACCESS LEVEL"}
                  </span>
                </div>
              </div>

              {/* Medical notes */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Medical Notes & Health Alerts</label>
                <textarea
                  rows={2}
                  placeholder="Allergies, chronic conditions, daily prescriptions..."
                  value={editInmateForm.medicalNotes}
                  onChange={(e) => setEditInmateForm({...editInmateForm, medicalNotes: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              {/* Case Notes */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Case Evaluation & Rehabilitation Notes</label>
                <textarea
                  rows={3}
                  placeholder="Social context, cooperative rating, psychological evaluation overview..."
                  value={editInmateForm.caseNotes}
                  onChange={(e) => setEditInmateForm({...editInmateForm, caseNotes: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              {/* Form Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-medium rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition-colors shadow-xs cursor-pointer"
                >
                  Save Dossier Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
