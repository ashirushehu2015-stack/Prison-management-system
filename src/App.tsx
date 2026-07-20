import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import InmatesList from "./components/InmatesList";
import HousingManager from "./components/HousingManager";
import GuardRoster from "./components/GuardRoster";
import IncidentLogs from "./components/IncidentLogs";
import VisitorLog from "./components/VisitorLog";
import UserManagement from "./components/UserManagement";
import Login from "./components/Login";

import { Inmate, Cell, Guard, Incident, Visit, UserAccount } from "./types";
import { 
  INITIAL_INMATES, 
  INITIAL_CELLS, 
  INITIAL_GUARDS, 
  INITIAL_VISITS, 
  INITIAL_INCIDENTS,
  INITIAL_USERS
} from "./data";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  // Core database state
  const [inmates, setInmates] = useState<Inmate[]>(INITIAL_INMATES);
  const [cells, setCells] = useState<Cell[]>(INITIAL_CELLS);
  const [guards, setGuards] = useState<Guard[]>(INITIAL_GUARDS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [visits, setVisits] = useState<Visit[]>(INITIAL_VISITS);
  
  // User Accounts & Login Session State
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // State Handlers
  const handleAddInmate = (newInmate: Inmate) => {
    setInmates((prev) => [newInmate, ...prev]);
    
    // Register occupant in target cell
    setCells((prevCells) =>
      prevCells.map((cell) => {
        if (cell.block === newInmate.cellBlock && cell.number === newInmate.cellNumber) {
          return {
            ...cell,
            currentOccupants: [...cell.currentOccupants, newInmate.id]
          };
        }
        return cell;
      })
    );
  };

  const handleUpdateInmate = (updatedInmate: Inmate) => {
    setInmates((prev) =>
      prev.map((i) => (i.id === updatedInmate.id ? updatedInmate : i))
    );
  };

  const handleTransferInmate = (inmateId: string, fromCellId: string | null, toCellId: string) => {
    const targetCell = cells.find(c => c.id === toCellId);
    if (!targetCell) return;

    // 1. Update Inmate cell specs
    setInmates((prev) =>
      prev.map((i) => {
        if (i.id === inmateId) {
          return {
            ...i,
            cellBlock: targetCell.block,
            cellNumber: targetCell.number
          };
        }
        return i;
      })
    );

    // 2. Update Cells rosters
    setCells((prevCells) =>
      prevCells.map((cell) => {
        let occupants = [...cell.currentOccupants];
        
        // Remove from source cell
        if (fromCellId && cell.id === fromCellId) {
          occupants = occupants.filter((id) => id !== inmateId);
        }
        
        // Append to target cell
        if (cell.id === toCellId) {
          if (!occupants.includes(inmateId)) {
            occupants.push(inmateId);
          }
        }

        return {
          ...cell,
          currentOccupants: occupants
        };
      })
    );
  };

  const handleUpdateCellStatus = (cellId: string, status: "Active" | "Maintenance" | "Locked Down") => {
    setCells((prev) =>
      prev.map((c) => (c.id === cellId ? { ...c, status } : c))
    );
  };

  const handleAddGuard = (newGuard: Guard) => {
    setGuards((prev) => [newGuard, ...prev]);
  };

  const handleUpdateGuardStatus = (guardId: string, status: "Active" | "On Leave" | "Suspended") => {
    setGuards((prev) =>
      prev.map((g) => (g.id === guardId ? { ...g, status } : g))
    );
  };

  const handleAddIncident = (newIncident: Incident) => {
    setIncidents((prev) => [newIncident, ...prev]);
  };

  const handleUpdateIncidentStatus = (incidentId: string, status: "Under Investigation" | "Resolved" | "Closed") => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status } : inc))
    );
  };

  const handleAddVisit = (newVisit: Visit) => {
    setVisits((prev) => [newVisit, ...prev]);
  };

  const handleUpdateVisitStatus = (visitId: string, status: "Approved" | "Pending" | "Completed" | "Denied") => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status } : v))
    );
  };

  // User Account Action Handlers
  const handleAddUser = (newUser: UserAccount) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    // If updating current logged in user (e.g. self-editing name/email)
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentTab("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab("dashboard");
  };

  // Render correct panel
  const renderTabContent = () => {
    if (!currentUser) return null;

    switch (currentTab) {
      case "dashboard":
        return (
          <Dashboard
            inmates={inmates}
            cells={cells}
            guards={guards}
            incidents={incidents}
            visits={visits}
            setCurrentTab={setCurrentTab}
            currentUser={currentUser}
          />
        );
      case "inmates":
        return (
          <InmatesList
            inmates={inmates}
            onAddInmate={handleAddInmate}
            onUpdateInmate={handleUpdateInmate}
            cellOptions={cells.map((c) => `${c.block} Cell ${c.number}`)}
            currentUser={currentUser}
          />
        );
      case "housing":
        return (
          <HousingManager
            cells={cells}
            inmates={inmates}
            onTransferInmate={handleTransferInmate}
            onUpdateCellStatus={handleUpdateCellStatus}
          />
        );
      case "guards":
        return (
          <GuardRoster
            guards={guards}
            onAddGuard={handleAddGuard}
            onUpdateGuardStatus={handleUpdateGuardStatus}
            currentUser={currentUser}
          />
        );
      case "incidents":
        return (
          <IncidentLogs
            incidents={incidents}
            inmates={inmates}
            guards={guards}
            onAddIncident={handleAddIncident}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            currentUser={currentUser}
          />
        );
      case "visits":
        return (
          <VisitorLog
            visits={visits}
            inmates={inmates}
            onAddVisit={handleAddVisit}
            onUpdateVisitStatus={handleUpdateVisitStatus}
            currentUser={currentUser}
          />
        );
      case "users":
        return (
          <UserManagement
            users={users}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      default:
        return <div className="p-8">Panel not implemented.</div>;
    }
  };

  // Login Gate
  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  const activeInmatesCount = inmates.filter((i) => i.status === "Incarcerated").length;
  const activeIncidentsCount = incidents.filter((i) => i.status === "Under Investigation").length;

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 animate-fade-in">
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        inmatesCount={activeInmatesCount}
        activeIncidentsCount={activeIncidentsCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </main>
    </div>
  );
}
