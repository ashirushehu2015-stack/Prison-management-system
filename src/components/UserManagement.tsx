import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Key, 
  Shield, 
  UserX, 
  UserCheck, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  X,
  Info
} from "lucide-react";
import { UserAccount, UserRole } from "../types";

interface UserManagementProps {
  users: UserAccount[];
  currentUser: UserAccount;
  onAddUser: (user: UserAccount) => void;
  onUpdateUser: (user: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
}

export default function UserManagement({ 
  users, 
  currentUser, 
  onAddUser, 
  onUpdateUser, 
  onDeleteUser 
}: UserManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  
  // New User Form State
  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    role: "Guard" as UserRole,
    email: "",
    password: "",
    status: "Active" as "Active" | "Suspended"
  });

  // Edit User Form State
  const [editForm, setEditForm] = useState({
    name: "",
    role: "Guard" as UserRole,
    email: "",
    status: "Active" as "Active" | "Suspended"
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.name || !newUser.email || !newUser.password) return;

    const added: UserAccount = {
      id: `U-${Math.floor(100 + Math.random() * 900)}`,
      username: newUser.username.toLowerCase().trim(),
      name: newUser.name.trim(),
      role: newUser.role,
      email: newUser.email.trim(),
      status: newUser.status,
      password: newUser.password,
      lastActive: "Never",
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&h=150&fit=crop`
    };

    onAddUser(added);
    setIsAddModalOpen(false);
    setNewUser({
      username: "",
      name: "",
      role: "Guard",
      email: "",
      password: "",
      status: "Active"
    });
  };

  const handleEditClick = (user: UserAccount) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      role: user.role,
      email: user.email,
      status: user.status
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated: UserAccount = {
      ...editingUser,
      name: editForm.name.trim(),
      role: editForm.role,
      email: editForm.email.trim(),
      status: editForm.status
    };

    onUpdateUser(updated);
    setEditingUser(null);
  };

  const toggleUserStatus = (user: UserAccount) => {
    if (user.id === currentUser.id) {
      alert("You cannot suspend your own current active administrator session!");
      return;
    }
    const updated: UserAccount = {
      ...user,
      status: user.status === "Active" ? "Suspended" : "Active"
    };
    onUpdateUser(updated);
  };

  const handleDeleteClick = (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot delete your own current active administrator account!");
      return;
    }
    if (confirm("Are you sure you want to revoke and delete this operator account from the system ledger? This is an irreversible security override.")) {
      onDeleteUser(userId);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return "bg-rose-100 text-rose-800 border-rose-200 font-bold";
      case "Warden":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 font-semibold";
      case "Guard":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 font-medium";
      case "Medical":
        return "bg-sky-100 text-sky-800 border-sky-200 font-medium";
      case "Visitor Desk":
        return "bg-amber-100 text-amber-800 border-amber-200 font-medium";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusBadge = (status: "Active" | "Suspended") => {
    if (status === "Active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">User Operator Accounts</h2>
          <p className="text-sm text-slate-500">Manage security credentials, permissions, and status controls for facility staff operators.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <UserPlus className="w-4.5 h-4.5" /> Provision New Operator
        </button>
      </div>

      {/* Security Level Warning Banner */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400 mt-0.5 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide text-white uppercase">System Administrator Overrides Active</h3>
            <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
              As an authorized Warden Chief Admin, you can provision new credentials, edit roles, audit passwords, and suspend compromised operator accounts instantly. Changes apply in real time.
            </p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-400 font-bold bg-slate-800 px-2.5 py-1 rounded select-none">
          LOGGED IN AS: {currentUser.name}
        </div>
      </div>

      {/* Operators Grid / Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Operator Registries</h3>
            <p className="text-xs text-slate-500">System operator access accounts matching role authorizations.</p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-bold">
            TOTAL USERS: {users.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
                <th className="p-4">Staff details</th>
                <th className="p-4">Username</th>
                <th className="p-4">Role / Access Clearance</th>
                <th className="p-4">System Email</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isSelf = u.id === currentUser.id;
                return (
                  <tr key={u.id} className={`hover:bg-slate-50/60 transition-colors ${isSelf ? "bg-slate-50/40" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"} 
                          alt={u.name}
                          className="w-8 h-8 rounded-full border border-slate-200 object-crop"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-semibold text-slate-800 block text-sm leading-none flex items-center gap-1.5">
                            {u.name}
                            {isSelf && (
                              <span className="text-[9px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                                You
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-slate-400 text-[10px] font-semibold block mt-1">{u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-700">
                      @{u.username}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 border text-[10px] font-semibold rounded uppercase tracking-wider ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-600 font-mono">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {u.email}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {u.lastActive || "Never"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-full ${getStatusBadge(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Status */}
                        <button
                          onClick={() => toggleUserStatus(u)}
                          disabled={isSelf}
                          title={isSelf ? "Cannot suspend yourself" : u.status === "Active" ? "Suspend Account" : "Activate Account"}
                          className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                            isSelf 
                              ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400" 
                              : u.status === "Active"
                                ? "border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                                : "border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
                          }`}
                        >
                          {u.status === "Active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditClick(u)}
                          title="Edit Operator Settings"
                          className="p-1.5 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClick(u.id)}
                          disabled={isSelf}
                          title={isSelf ? "Cannot delete yourself" : "De-register Operator Account"}
                          className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                            isSelf 
                              ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400" 
                              : "border-slate-200 text-slate-400 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* role descriptions */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500 leading-normal">
        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-rose-500" /> Warden & Admin clearances
          </h4>
          <p>
            Full permissions to edit housing cells, transfer inmates, log alerts, configure registries, and authorize visitation slots.
          </p>
        </div>
        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-500" /> Security Guard clearance
          </h4>
          <p>
            Primary access to log incidents, view active shifting timelines, and inspect inmate rosters, with limited housing override controls.
          </p>
        </div>
        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-sky-500" /> Visitor Desk & Medical staff
          </h4>
          <p>
            Authorized visitor check-in, legal screening logs, and health alerts. Restricted from editing prison rosters or guard personnel ledger.
          </p>
        </div>
      </div>

      {/* PROVISION NEW OPERATOR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">Provision Staff Operator</h3>
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
                <label className="block font-bold text-slate-600 mb-1">Username (Primary Ident) *</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="e.g., officer_smith"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Operator Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Officer Amanda Smith"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Assigned Access Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  >
                    <option value="Admin">Chief Admin</option>
                    <option value="Warden">Deputy Warden</option>
                    <option value="Guard">Security Guard</option>
                    <option value="Visitor Desk">Visitor Desk</option>
                    <option value="Medical">Medical Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Security Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({...newUser, status: e.target.value as any})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  >
                    <option value="Active">Active Clearance</option>
                    <option value="Suspended">Suspended / Revoked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">System Email address *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="a.smith@corrections.gov"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Secure Password *</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="••••••••"
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
                  Confirm Provisioning
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT OPERATOR MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">Modify Operator Permissions</h3>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-400 mb-1">Username (Read-Only)</label>
                <input
                  type="text"
                  disabled
                  value={`@${editingUser.username}`}
                  className="w-full p-2 bg-slate-100 border border-slate-200 text-slate-400 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Operator Full Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Assigned Access Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value as UserRole})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                  >
                    <option value="Admin">Chief Admin</option>
                    <option value="Warden">Deputy Warden</option>
                    <option value="Guard">Security Guard</option>
                    <option value="Visitor Desk">Visitor Desk</option>
                    <option value="Medical">Medical Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Security Status</label>
                  <select
                    value={editForm.status}
                    disabled={editingUser.id === currentUser.id}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value as any})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 disabled:opacity-50"
                  >
                    <option value="Active">Active Clearance</option>
                    <option value="Suspended">Suspended / Revoked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">System Email address *</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-medium rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded shadow-xs cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
