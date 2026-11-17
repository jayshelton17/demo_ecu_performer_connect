import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Shield,
  FileSpreadsheet,
  Users,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Eye,
  X,
  Save,
  Check,
} from 'lucide-react';
import { ReportItem, UserProfile, FacultyMember } from '../types.ts';

export const Admin: React.FC = () => {
  const {
    adminSubTab,
    setAdminSubTab,
    reports,
    updateReportStatus,
    users,
    updateUserProfile,
    faculty,
    addFacultyMember,
    updateFacultyMember,
    castingCalls,
    showNotification,
    setSelectedUserId,
    setCurrentView,
  } = useApp();

  // Search & Filter States
  const [reportSearch, setReportSearch] = useState('');
  const [reportStatusFilter, setReportStatusFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userAdminFilter, setUserAdminFilter] = useState('All');
  const [facultySearch, setFacultySearch] = useState('');

  // Modals & Detail Overlays matching wireframes
  const [activeReportDetail, setActiveReportDetail] = useState<ReportItem | null>(null);
  const [activeUserDetail, setActiveUserDetail] = useState<UserProfile | null>(null);
  const [activeFacultyDetail, setActiveFacultyDetail] = useState<FacultyMember | null>(null);
  const [isAddFacultyModalOpen, setIsAddFacultyModalOpen] = useState(false);

  // Add Faculty Form State
  const [newFacFirst, setNewFacFirst] = useState('');
  const [newFacLast, setNewFacLast] = useState('');
  const [newFacEmail, setNewFacEmail] = useState('');
  const [newFacIsAdmin, setNewFacIsAdmin] = useState(false);

  // Edit User Detail State
  const [editUserRoles, setEditUserRoles] = useState<{ performer: boolean; director: boolean }>({
    performer: true,
    director: false,
  });
  const [editUserAdmin, setEditUserAdmin] = useState(false);

  // Edit Report Detail State
  const [selectedAdminAction, setSelectedAdminAction] = useState('Warn User');
  const [reportNotes, setReportNotes] = useState('');

  const openUserDetail = (u: UserProfile) => {
    setActiveUserDetail(u);
    setEditUserRoles({
      performer: u.role.includes('Performer'),
      director: u.role.includes('Director'),
    });
    setEditUserAdmin(!!u.isAdmin);
  };

  const handleSaveUserDetails = () => {
    if (!activeUserDetail) return;
    let newRole: any = 'Performer';
    if (editUserRoles.performer && editUserRoles.director) newRole = 'Performer & Director';
    else if (editUserRoles.director) newRole = 'Director';

    updateUserProfile({
      ...activeUserDetail,
      role: newRole,
      isAdmin: editUserAdmin,
    });
    showNotification(`Updated profile roles & access for ${activeUserDetail.name}`);
    setActiveUserDetail(null);
  };

  const openReportDetail = (r: ReportItem) => {
    setActiveReportDetail(r);
    setSelectedAdminAction(r.adminAction || 'Warn User');
    setReportNotes(r.adminNotes || '');
  };

  const handleSaveReportAction = () => {
    if (!activeReportDetail) return;
    updateReportStatus(activeReportDetail.id, 'Resolved', selectedAdminAction, reportNotes);
    showNotification(`Report #${activeReportDetail.reportNumber} updated with action: ${selectedAdminAction}`);
    setActiveReportDetail(null);
  };

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacFirst.trim() || !newFacEmail.trim()) return;

    addFacultyMember({
      name: `${newFacFirst} ${newFacLast}`.trim(),
      firstName: newFacFirst,
      lastName: newFacLast,
      email: newFacEmail,
      department: 'School of Theatre and Dance',
      isAdmin: newFacIsAdmin,
      status: 'Active',
    });

    setNewFacFirst('');
    setNewFacLast('');
    setNewFacEmail('');
    setNewFacIsAdmin(false);
    setIsAddFacultyModalOpen(false);
  };

  // Filtered Lists
  const filteredReports = reports.filter((r) => {
    const q = reportSearch.toLowerCase();
    const matchesQ =
      !q ||
      r.reportNumber.toLowerCase().includes(q) ||
      r.reportedTarget.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    const matchesStatus = reportStatusFilter === 'All' || r.status === reportStatusFilter;
    return matchesQ && matchesStatus;
  });

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    const matchesQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = userRoleFilter === 'All' || u.role.includes(userRoleFilter);
    const matchesAdmin =
      userAdminFilter === 'All' || (userAdminFilter === 'Admin' ? u.isAdmin : !u.isAdmin);
    return matchesQ && matchesRole && matchesAdmin;
  });

  const filteredFaculty = faculty.filter((f) => {
    const q = facultySearch.toLowerCase();
    return !q || f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#4C1D95] text-[#FEC524] flex items-center justify-center font-bold shadow-md">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            ECU Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            School of Theatre & Dance moderation, user verification, and faculty roles
          </p>
        </div>
      </div>

      {/* Admin Layout with Sidebar matching wireframes: Dashboard | Reports | Users | Faculty */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Sidebar */}
        <div className="md:col-span-3 p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 h-fit">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-400 px-3 py-1 block">
            Admin
          </span>

          <button
            onClick={() => setAdminSubTab('dashboard')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              adminSubTab === 'dashboard'
                ? 'bg-[#4C1D95] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 text-[#FEC524]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setAdminSubTab('reports')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              adminSubTab === 'reports'
                ? 'bg-[#4C1D95] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Reports</span>
            </div>
            {reports.filter((r) => r.status === 'Open').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          <button
            onClick={() => setAdminSubTab('users')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              adminSubTab === 'users'
                ? 'bg-[#4C1D95] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
          </button>

          <button
            onClick={() => setAdminSubTab('faculty')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              adminSubTab === 'faculty'
                ? 'bg-[#4C1D95] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Faculty</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-9 p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          
          {/* TAB 1: Dashboard matching Admin_Dashboard_e3bb8249.png */}
          {adminSubTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Dashboard
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time metrics for audition reports, verified students, and faculty moderators
                </p>
              </div>

              {/* Metric Cards matching wireframe: Open Reports | Users | Faculty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setAdminSubTab('reports')}
                  className="p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 cursor-pointer hover:shadow-md transition-all space-y-2"
                >
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider block">
                    Open Reports
                  </span>
                  <div className="text-3xl font-extrabold text-amber-800 dark:text-amber-300 font-display">
                    {reports.filter((r) => r.status === 'Open' || r.status === 'In Review').length}
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    ({reports.length} Total Reports Filed)
                  </p>
                </div>

                <div
                  onClick={() => setAdminSubTab('users')}
                  className="p-6 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 cursor-pointer hover:shadow-md transition-all space-y-2"
                >
                  <span className="text-xs font-bold text-[#4C1D95] dark:text-[#FEC524] uppercase tracking-wider block">
                    Users
                  </span>
                  <div className="text-3xl font-extrabold text-[#4C1D95] dark:text-white font-display">
                    {users.length}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ({users.filter((u) => u.role.includes('Performer')).length} Performers,{' '}
                    {users.filter((u) => u.role.includes('Director')).length} Directors)
                  </p>
                </div>

                <div
                  onClick={() => setAdminSubTab('faculty')}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-md transition-all space-y-2"
                >
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Faculty
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                    {faculty.length}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ({faculty.filter((f) => f.isAdmin).length} Administrators)
                  </p>
                </div>
              </div>

              {/* Active Auditions Summary */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Active Casting Notices
                  </span>
                  <button
                    onClick={() => setCurrentView('casting-calls')}
                    className="text-xs font-bold text-[#4C1D95] dark:text-[#FEC524] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-2">
                  {castingCalls.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{c.title}</span>
                        <span className="text-slate-400 ml-2">({c.productionType})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">Audition Deadline: {c.deadline}</span>
                        <span className="font-semibold text-[#4C1D95] dark:text-[#FEC524]">
                          {c.characters.length} Roles
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Reports matching Admin_Reports_6a0e3aef.png */}
          {adminSubTab === 'reports' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Reports
                </h2>
                <p className="text-xs text-slate-500">
                  Review reported content, policy violations, and harassment submissions
                </p>
              </div>

              {/* Filters row: Search: [ ] Status: [ ] */}
              <div className="flex flex-col sm:flex-row gap-3 text-xs">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search reports by # or content..."
                    value={reportSearch}
                    onChange={(e) => setReportSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-slate-500 font-semibold">Status:</label>
                  <select
                    value={reportStatusFilter}
                    onChange={(e) => setReportStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Table matching wireframe columns: Date | Type | Report By | Status | Action */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50/60 dark:bg-slate-800/40">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Report By</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredReports.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-3 font-mono text-slate-500">{r.date}</td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                          <div>{r.type}</div>
                          <div className="text-[10px] text-slate-400 font-normal truncate max-w-xs">{r.reportedTarget}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{r.reportedBy}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.status === 'Open'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                : r.status === 'In Review'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => openReportDetail(r)}
                            className="px-3 py-1 rounded-lg bg-[#4C1D95] text-white hover:bg-[#3B0764] font-bold text-xs"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Users matching Admin_Users_1098b59e.png */}
          {adminSubTab === 'users' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Users
                </h2>
                <p className="text-xs text-slate-500">
                  Manage ECU student and performer accounts and assign administrator status
                </p>
              </div>

              {/* Filters row matching wireframe: Search: [ ] Role: [ ] Admin: [ ] */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-slate-500 font-semibold">Role:</label>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="All">All Roles</option>
                    <option value="Performer">Performer</option>
                    <option value="Director">Director</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-slate-500 font-semibold">Admin:</label>
                  <select
                    value={userAdminFilter}
                    onChange={(e) => setUserAdminFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="All">All</option>
                    <option value="Admin">Admin Only</option>
                    <option value="Standard">Standard Users</option>
                  </select>
                </div>
              </div>

              {/* Table matching wireframe columns: Name | Type | Role | Admin | Action */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50/60 dark:bg-slate-800/40">
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Admin</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.avatarUrl}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                              <span className="text-[10px] text-slate-400">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          {u.category || 'Student'}
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#4C1D95] dark:text-[#FEC524]">
                          {u.role}
                        </td>
                        <td className="py-3 px-3">
                          {u.isAdmin ? (
                            <span className="font-bold text-purple-600 dark:text-purple-400">Yes</span>
                          ) : (
                            <span className="text-slate-400">No</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => openUserDetail(u)}
                            className="px-3 py-1 rounded-lg bg-[#4C1D95] text-white hover:bg-[#3B0764] font-bold text-xs"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Faculty matching Admin_Faculty_fd9f5df8.png */}
          {adminSubTab === 'faculty' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                    Faculty
                  </h2>
                  <p className="text-xs text-slate-500">
                    East Carolina University School of Theatre and Dance professors & directors
                  </p>
                </div>

                <button
                  onClick={() => setIsAddFacultyModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#FEC524]" />
                  <span>+ Add Faculty</span>
                </button>
              </div>

              {/* Search & filter */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search faculty by name or email..."
                    value={facultySearch}
                    onChange={(e) => setFacultySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                </div>
              </div>

              {/* Table matching wireframe columns: Name | Email | Admin | Action */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50/60 dark:bg-slate-800/40">
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Admin</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredFaculty.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                          {f.name}
                          <span className="block text-[10px] text-slate-400 font-normal">{f.department}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{f.email}</td>
                        <td className="py-3 px-3">
                          {f.isAdmin ? (
                            <span className="font-bold text-[#4C1D95] dark:text-[#FEC524]">Administrator</span>
                          ) : (
                            <span className="text-slate-400">Standard Faculty</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setActiveFacultyDetail(f)}
                            className="px-3 py-1 rounded-lg bg-[#4C1D95] text-white hover:bg-[#3B0764] font-bold text-xs"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* OVERLAY 1: Report Details matching Admin_Report_Details_7242c104.png */}
      {activeReportDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-xs text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-red-500 uppercase">
                  Report #{activeReportDetail.reportNumber}
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Reports Details
                </h3>
              </div>
              <button onClick={() => setActiveReportDetail(null)} className="p-1 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reported Content details matching wireframe */}
            <div className="space-y-3">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block border-b border-slate-100 dark:border-slate-800 pb-1">
                Reported Content
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Type: </span>
                  <span className="font-bold">{activeReportDetail.type}</span>
                </div>
                <div>
                  <span className="text-slate-500">Reported By: </span>
                  <span>{activeReportDetail.reportedBy}</span>
                </div>
                <div>
                  <span className="text-slate-500">Target / Profile: </span>
                  <span className="font-medium text-[#4C1D95] dark:text-[#FEC524]">{activeReportDetail.reportedTarget}</span>
                </div>
                <div>
                  <span className="text-slate-500">Date: </span>
                  <span>{activeReportDetail.date}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Reason:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">{activeReportDetail.reason}</p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Description:</span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeReportDetail.description}
                </p>
              </div>

              {activeReportDetail.evidence && (
                <div>
                  <span className="text-slate-500 font-semibold block mb-0.5">Supporting Evidence:</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px] inline-block">
                    [{activeReportDetail.evidence}]
                  </span>
                </div>
              )}
            </div>

            {/* Admin Action & Notes matching wireframe */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div>
                <label className="font-bold block mb-1">Admin Action:</label>
                <select
                  value={selectedAdminAction}
                  onChange={(e) => setSelectedAdminAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                >
                  <option value="Warn User">Warn User & Issue Notice</option>
                  <option value="Remove Content">Remove Casting Notice / Content</option>
                  <option value="Suspend Account">Suspend Account (30 Days)</option>
                  <option value="Dismiss Report">Dismiss Report (No Violation)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Admin Notes:</label>
                <input
                  type="text"
                  placeholder="Official notes for ECU Theatre Ethics Committee..."
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveReportDetail(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
              >
                Close
              </button>
              <button
                onClick={handleSaveReportAction}
                className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] font-bold"
              >
                Save Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 2: User Details matching Admin_User_Details_536d54ed.png */}
      {activeUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-xs text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Status: {activeUserDetail.status}</span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {activeUserDetail.name}
                </h3>
              </div>
              <button onClick={() => setActiveUserDetail(null)} className="p-1 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Information */}
            <div className="space-y-3">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block border-b border-slate-100 dark:border-slate-800 pb-1">
                Account Information
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Email: </span>
                  <span className="font-mono">{activeUserDetail.email}</span>
                </div>
                <div>
                  <span className="text-slate-500">Category: </span>
                  <span>{activeUserDetail.category || 'Student'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Date Enrolled: </span>
                  <span>{activeUserDetail.dateEnrolled || 'August 2023'}</span>
                </div>
              </div>
            </div>

            {/* Profile Roles checkboxes matching wireframe */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                Profile Roles
              </span>

              <div className="space-y-2 pl-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editUserRoles.performer}
                    onChange={(e) =>
                      setEditUserRoles((prev) => ({ ...prev, performer: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-[#4C1D95]"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Performer</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editUserRoles.director}
                    onChange={(e) =>
                      setEditUserRoles((prev) => ({ ...prev, director: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-[#4C1D95]"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Director</span>
                </label>
              </div>
            </div>

            {/* Admin Access checkbox matching wireframe */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                Admin Access
              </span>

              <label className="flex items-center gap-2 cursor-pointer pl-1">
                <input
                  type="checkbox"
                  checked={editUserAdmin}
                  onChange={(e) => setEditUserAdmin(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4C1D95]"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Administrator</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveUserDetail(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUserDetails}
                className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 3: Faculty Details matching Admin_Faculty_Details_9134f330.png */}
      {activeFacultyDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-xs text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Status: {activeFacultyDetail.status}</span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {activeFacultyDetail.name}
                </h3>
              </div>
              <button onClick={() => setActiveFacultyDetail(null)} className="p-1 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Information */}
            <div className="space-y-3">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block border-b border-slate-100 dark:border-slate-800 pb-1">
                Account Information
              </span>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500">Email: </span>
                  <span className="font-mono">{activeFacultyDetail.email}</span>
                </div>
                <div>
                  <span className="text-slate-500">Department: </span>
                  <span>{activeFacultyDetail.department}</span>
                </div>
              </div>
            </div>

            {/* Admin Access matching wireframe */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                Admin Access
              </span>

              <label className="flex items-center gap-2 cursor-pointer pl-1">
                <input
                  type="checkbox"
                  checked={activeFacultyDetail.isAdmin}
                  onChange={(e) =>
                    updateFacultyMember(activeFacultyDetail.id, { isAdmin: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#4C1D95]"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Administrator</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveFacultyDetail(null)}
                className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 4: Add Faculty matching Admin_Add_Faculty_a141360a.png */}
      {isAddFacultyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-xs text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Add Faculty
              </h3>
              <button onClick={() => setIsAddFacultyModalOpen(false)} className="p-1 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFaculty} className="space-y-4">
              <div>
                <label className="font-bold block mb-1">First Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Katherine"
                  value={newFacFirst}
                  onChange={(e) => setNewFacFirst(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Last Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ross"
                  value={newFacLast}
                  onChange={(e) => setNewFacLast(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Email:</label>
                <input
                  type="email"
                  required
                  placeholder="rossk@ecu.edu"
                  value={newFacEmail}
                  onChange={(e) => setNewFacEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFacIsAdmin}
                    onChange={(e) => setNewFacIsAdmin(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4C1D95]"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Administrator</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddFacultyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] font-bold shadow"
                >
                  Add Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
