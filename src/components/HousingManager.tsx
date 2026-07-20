import React, { useState } from "react";
import { 
  Building2, 
  DoorOpen, 
  Settings, 
  AlertTriangle, 
  ArrowLeftRight, 
  CheckCircle,
  X,
  User,
  Shield,
  Clock,
  Wrench,
  Lock
} from "lucide-react";
import { Inmate, Cell, SecurityLevel } from "../types";

interface HousingManagerProps {
  cells: Cell[];
  inmates: Inmate[];
  onTransferInmate: (inmateId: string, fromCellId: string | null, toCellId: string) => void;
  onUpdateCellStatus: (cellId: string, status: "Active" | "Maintenance" | "Locked Down") => void;
}

export default function HousingManager({ cells, inmates, onTransferInmate, onUpdateCellStatus }: HousingManagerProps) {
  const [selectedBlock, setSelectedBlock] = useState<string>("Block A");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Transfer form state
  const [transferState, setTransferState] = useState({
    inmateId: "",
    targetCellId: ""
  });

  // Get occupants for a cell
  const getCellOccupants = (cell: Cell) => {
    return inmates.filter(inmate => inmate.cellBlock === cell.block && inmate.cellNumber === cell.number && inmate.status === "Incarcerated");
  };

  // Block metrics
  const getBlockMetrics = (block: string) => {
    const blockCells = cells.filter(c => c.block === block);
    const activeCells = blockCells.filter(c => c.status === "Active");
    const capacity = activeCells.reduce((sum, c) => sum + c.capacity, 0);
    const occupantsCount = blockCells.reduce((sum, c) => sum + getCellOccupants(c).length, 0);
    return {
      totalCells: blockCells.length,
      maintenanceCount: blockCells.filter(c => c.status === "Maintenance").length,
      lockdownCount: blockCells.filter(c => c.status === "Locked Down").length,
      capacity,
      occupantsCount,
      occupancyRate: capacity > 0 ? Math.round((occupantsCount / capacity) * 100) : 0
    };
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferState.inmateId || !transferState.targetCellId) return;

    const inmate = inmates.find(i => i.id === transferState.inmateId);
    if (!inmate) return;

    // Find old cell
    const oldCell = cells.find(c => c.block === inmate.cellBlock && c.number === inmate.cellNumber);
    const oldCellId = oldCell?.id || null;

    onTransferInmate(transferState.inmateId, oldCellId, transferState.targetCellId);
    setIsTransferModalOpen(false);
    setTransferState({ inmateId: "", targetCellId: "" });
  };

  const activeBlockCells = cells.filter(cell => cell.block === selectedBlock);
  const activeInmates = inmates.filter(i => i.status === "Incarcerated");

  const getStatusIcon = (status: string) => {
    if (status === "Maintenance") return <Wrench className="w-3.5 h-3.5 text-amber-500" />;
    if (status === "Locked Down") return <Lock className="w-3.5 h-3.5 text-rose-500" />;
    return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === "Maintenance") return "bg-amber-50 text-amber-800 border-amber-200";
    if (status === "Locked Down") return "bg-rose-50 text-rose-800 border-rose-200";
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Housing & Cell Management</h2>
          <p className="text-sm text-slate-500">Supervise inmate placement, block safety settings, and cell maintenance schedules.</p>
        </div>
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="flex items-center gap-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeftRight className="w-4 h-4" /> Relocate / Transfer Inmate
        </button>
      </div>

      {/* Block Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {["Block A", "Block B", "Block C"].map((blockName) => {
          const metrics = getBlockMetrics(blockName);
          const isSelected = selectedBlock === blockName;
          const securityText = blockName === "Block C" ? "Maximum" : blockName === "Block A" ? "Medium" : "Minimum";
          
          return (
            <div
              key={blockName}
              onClick={() => setSelectedBlock(blockName)}
              className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected 
                  ? "bg-rose-50/50 border-rose-500 shadow-sm ring-1 ring-rose-500/10" 
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-none">{blockName}</h3>
                    <span className="text-[10px] text-slate-400 font-mono font-bold mt-1 block uppercase tracking-wider">{securityText} Security</span>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  metrics.occupancyRate >= 90 ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"
                }`}>
                  {metrics.occupancyRate}% Full
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4 space-y-2">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      metrics.occupancyRate >= 90 ? "bg-red-500" : metrics.occupancyRate >= 70 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(metrics.occupancyRate, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{metrics.occupantsCount} / {metrics.capacity} Beds Active</span>
                  <span className="font-mono">{metrics.totalCells} cells total</span>
                </div>
              </div>

              {/* Quick Status Tags */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-3.5 text-[10px] font-mono text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Wrench className="w-3.5 h-3.5 text-amber-500/80" /> {metrics.maintenanceCount} maint.</span>
                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-rose-500/80" /> {metrics.lockdownCount} locked</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Floor Map of cells inside the chosen block */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="font-bold text-slate-800 text-base">{selectedBlock} Cellular Floor Matrix</h3>
          <p className="text-xs text-slate-500">Select a cell to adjust maintenance schedules or examine current inmate profiles.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeBlockCells.map((cell) => {
            const occupants = getCellOccupants(cell);
            const isFull = occupants.length >= cell.capacity;
            const isLockdown = cell.status === "Locked Down";
            const isMaint = cell.status === "Maintenance";

            return (
              <div 
                key={cell.id} 
                className={`p-4 rounded-xl border transition-all space-y-4 flex flex-col justify-between ${
                  isLockdown 
                    ? "bg-rose-50/20 border-rose-200" 
                    : isMaint 
                    ? "bg-amber-50/20 border-amber-200" 
                    : "bg-slate-50/30 border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Cell Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">CELL</span>
                    <h4 className="text-base font-extrabold text-slate-800 leading-tight">{cell.number}</h4>
                  </div>
                  
                  {/* Status Dropdown selector */}
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadge(cell.status)}`}>
                      {getStatusIcon(cell.status)}
                      <span>{cell.status}</span>
                    </span>
                    <select
                      value={cell.status}
                      onChange={(e) => onUpdateCellStatus(cell.id, e.target.value as any)}
                      className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1 py-0.5 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maint</option>
                      <option value="Locked Down">Lock</option>
                    </select>
                  </div>
                </div>

                {/* Occupants list */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Occupancy ({occupants.length} / {cell.capacity})
                  </span>
                  {occupants.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic py-1 border border-dashed border-slate-200 rounded-lg text-center bg-white">
                      Cell vacant
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {occupants.map(occ => (
                        <div key={occ.id} className="flex items-center justify-between p-2 rounded bg-white border border-slate-200/60 text-xs">
                          <div className="flex items-center gap-2">
                            <img src={occ.avatarUrl} alt={occ.name} referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover border border-slate-200" />
                            <span className="font-semibold text-slate-700 truncate max-w-[120px]">{occ.name}</span>
                          </div>
                          <span className="font-mono text-slate-400 text-[10px] font-bold">{occ.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cell Footer specifications */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold">
                  <span>Rating: {cell.securityLevel}</span>
                  <span className={isFull ? "text-rose-500 font-extrabold" : "text-emerald-600"}>
                    {isFull ? "AT CAPACITY" : `${cell.capacity - occupants.length} BEDS OPEN`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TRANSFER MODAL */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">Transfer / Relocation Command</h3>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleTransferSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Pick Inmate */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Select Incarcerated Inmate</label>
                <select
                  required
                  value={transferState.inmateId}
                  onChange={(e) => {
                    const inmate = inmates.find(i => i.id === e.target.value);
                    setTransferState({
                      ...transferState,
                      inmateId: e.target.value
                    });
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="">-- Choose Inmate --</option>
                  {activeInmates.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.id}) - Current: {i.cellBlock} {i.cellNumber} [{i.securityLevel}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Pick Cell */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Select Destination Cell</label>
                <select
                  required
                  value={transferState.targetCellId}
                  onChange={(e) => setTransferState({...transferState, targetCellId: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="">-- Choose Target Cell --</option>
                  {cells
                    .filter(c => c.status === "Active")
                    .map(c => {
                      const occupancy = getCellOccupants(c).length;
                      const hasSpace = occupancy < c.capacity;
                      if (!hasSpace) return null;
                      return (
                        <option key={c.id} value={c.id}>
                          {c.block} - Cell {c.number} (Beds: {occupancy}/{c.capacity}) - Rating: {c.securityLevel}
                        </option>
                      );
                    }).filter(Boolean)}
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-100 text-slate-500 leading-normal">
                <span className="font-bold text-slate-700 block mb-0.5">Cell Placement Alert:</span>
                For security compliance, always verify that the target cell's classification matches the inmate's security profile.
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-medium rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded cursor-pointer shadow-xs"
                >
                  Confirm Transfer
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
