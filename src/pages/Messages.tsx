import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Search, Plus, Send, ArrowLeft, User, ShieldAlert, Check } from 'lucide-react';

export const Messages: React.FC = () => {
  const {
    messages,
    selectedThreadId,
    setSelectedThreadId,
    sendMessage,
    users,
    currentUser,
    setCurrentView,
    setSelectedUserId,
    startNewThread,
  } = useApp();

  const [search, setSearch] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [newRecipientId, setNewRecipientId] = useState('');
  const [newRecipientInitialMsg, setNewRecipientInitialMsg] = useState('');

  const activeThread = messages.find((m) => m.id === selectedThreadId) || messages[0];

  const filteredThreads = messages.filter((t) => {
    const q = search.toLowerCase();
    return (
      !q ||
      t.participantName.toLowerCase().includes(q) ||
      t.lastMessage.toLowerCase().includes(q)
    );
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeThread) return;
    sendMessage(activeThread.id, typedMessage);
    setTypedMessage('');
  };

  const handleStartNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientId) return;
    const threadId = startNewThread(newRecipientId, newRecipientInitialMsg || 'Hi, connecting via ECU Performer Connect!');
    setSelectedThreadId(threadId);
    setIsNewMessageModalOpen(false);
    setNewRecipientId('');
    setNewRecipientInitialMsg('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Header matching Messages_5b0b51e8.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Messages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Communicate directly with directors, performers, and casting coordinators
          </p>
        </div>

        <button
          onClick={() => setIsNewMessageModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FEC524]" />
          <span>+ New Message</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        
        {/* Left Side: Conversation List matching wireframe */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col space-y-4">
          
          {/* Search bar matching wireframe: Search: [ ] */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Search:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* Threads list matching wireframe rows */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredThreads.map((thread) => {
              const isSelected = activeThread?.id === thread.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-[#4C1D95] dark:border-[#FEC524]'
                      : 'border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={thread.participantAvatar}
                      alt={thread.participantName}
                      className="w-11 h-11 rounded-full object-cover border border-[#4C1D95] shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {thread.participantName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {thread.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate font-normal">
                        {thread.lastMessage}
                      </p>
                    </div>

                    {thread.unread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4C1D95] dark:bg-[#FEC524] shrink-0 self-center" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Message Details Thread matching Message_Details_a9208f76.png */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          
          {/* Header matching wireframe: (Photo) (Sender Name) | View Profile | Report User */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={activeThread?.participantAvatar}
                alt={activeThread?.participantName}
                className="w-10 h-10 rounded-full object-cover border border-[#4C1D95]"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {activeThread?.participantName}
                </h3>
                <span className="text-[10px] text-slate-500">{activeThread?.participantRole}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedUserId(activeThread.participantId);
                  setCurrentView('profile');
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>View Profile</span>
              </button>

              <button
                onClick={() => setCurrentView('report-user')}
                className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-[11px] font-semibold flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report User</span>
              </button>
            </div>
          </div>

          {/* Messages bubbles thread */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4 max-h-[380px] pr-2">
            {activeThread?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                    msg.isMine
                      ? 'bg-[#4C1D95] text-white rounded-br-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Message Input matching wireframe: Type your message... + Send arrow */}
          <form onSubmit={handleSend} className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FEC524]"
              />
              <button
                type="submit"
                disabled={!typedMessage.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] disabled:opacity-40 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#FEC524]" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>

        </div>

      </div>

      {/* New Message Modal */}
      {isNewMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Start New Conversation</h3>
            
            <form onSubmit={handleStartNewMessage} className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Select Recipient:</label>
                <select
                  required
                  value={newRecipientId}
                  onChange={(e) => setNewRecipientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="">-- Choose Performer or Director --</option>
                  {users
                    .filter((u) => u.id !== currentUser.id)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Initial Message:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Introduce yourself, discuss audition sides, or share project notes..."
                  value={newRecipientInitialMsg}
                  onChange={(e) => setNewRecipientInitialMsg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewMessageModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#4C1D95] text-white font-bold"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
