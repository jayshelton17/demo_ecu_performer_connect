import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Plus, ArrowLeft, MoreHorizontal, Heart, Trash2, UserPlus, MessageSquare } from 'lucide-react';

export const Favorites: React.FC = () => {
  const {
    favoriteGroups,
    selectedFavoriteGroupId,
    setSelectedFavoriteGroupId,
    createFavoriteGroup,
    toggleUserInGroup,
    deleteFavoriteGroup,
    users,
    toggleFavoriteUser,
    setSelectedUserId,
    setCurrentView,
    startNewThread,
    setSelectedThreadId,
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'details'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [isAddPerformerModalOpen, setIsAddPerformerModalOpen] = useState(false);

  const activeGroup = favoriteGroups.find((g) => g.id === selectedFavoriteGroupId) || favoriteGroups[0];

  const groupMembers = users.filter((u) => activeGroup?.memberIds.includes(u.id));

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    createFavoriteGroup(newGroupName.trim(), newGroupDesc.trim());
    setNewGroupName('');
    setNewGroupDesc('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {viewMode === 'grid' ? (
        /* Favorites Groups Grid matching Favorites_6e531fd3.png */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
                Favorites
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Organize prospective talent into casting rosters, call lists, and ensembles
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#FEC524]" />
              <span>+ Create Group</span>
            </button>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {favoriteGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => {
                  setSelectedFavoriteGroupId(group.id);
                  setViewMode('details');
                }}
                className="group cursor-pointer rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-[#4C1D95] dark:hover:border-[#FEC524] transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-4/3 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                  <img
                    src={group.coverImage}
                    alt={group.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-bold text-white backdrop-blur-xs">
                    {group.memberIds.length} {group.memberIds.length === 1 ? 'person' : 'people'}
                  </div>
                </div>

                <div className="p-3.5 space-y-0.5">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-[#4C1D95] dark:group-hover:text-[#FEC524] transition-colors truncate">
                    {group.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate">
                    {group.description || 'Custom talent group'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Favorite Group Details matching Favorite_Group_Details_caf37a6a.png */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('grid')}
                className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {activeGroup.name}
                </h1>
                <p className="text-xs text-slate-500">
                  ({groupMembers.length} in group) · {activeGroup.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddPerformerModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#FEC524]" />
                <span>+ Add Performers</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete group "${activeGroup.name}"?`)) {
                    deleteFavoriteGroup(activeGroup.id);
                    setViewMode('grid');
                  }
                }}
                className="p-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                title="Delete group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid of talent cards matching wireframe: (Headshot) (Name) Heart */}
          {groupMembers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs text-slate-500">No performers added to this group yet.</p>
              <button
                onClick={() => setIsAddPerformerModalOpen(true)}
                className="text-xs font-bold text-[#4C1D95] dark:text-[#FEC524] hover:underline"
              >
                Add performers now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {groupMembers.map((member) => (
                <div
                  key={member.id}
                  className="group rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div
                    onClick={() => {
                      setSelectedUserId(member.id);
                      setCurrentView('profile');
                    }}
                    className="aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative cursor-pointer"
                  >
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteUser(member.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-red-500 hover:bg-black/70"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4
                        onClick={() => {
                          setSelectedUserId(member.id);
                          setCurrentView('profile');
                        }}
                        className="font-bold text-xs text-slate-900 dark:text-white truncate cursor-pointer hover:underline"
                      >
                        {member.name}
                      </h4>
                      <button
                        onClick={() => toggleUserInGroup(activeGroup.id, member.id)}
                        className="text-[10px] text-slate-400 hover:text-red-500"
                        title="Remove from this group"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">
                      {member.characteristics.vocalRange || member.role}
                    </p>

                    <button
                      onClick={() => {
                        const tid = startNewThread(member.id, `Hi ${member.name}!`);
                        setSelectedThreadId(tid);
                        setCurrentView('message-details');
                      }}
                      className="w-full mt-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3 text-[#4C1D95] dark:text-[#FEC524]" />
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Favorite Group</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Group Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spring 2026 Callback Contenders"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Leading soprano roles and potential Mabel alternates"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#4C1D95] text-white font-bold"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Performer to Group Modal */}
      {isAddPerformerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Performers to {activeGroup.name}
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {users.map((u) => {
                const inGroup = activeGroup.memberIds.includes(u.id);
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                        <span className="text-[10px] text-slate-500">{u.role}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleUserInGroup(activeGroup.id, u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        inGroup
                          ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300'
                          : 'bg-[#4C1D95] text-white'
                      }`}
                    >
                      {inGroup ? 'Remove' : '+ Add'}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsAddPerformerModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-[#4C1D95] text-white font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
