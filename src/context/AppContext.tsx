import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  CastingCall,
  Application,
  MessageThread,
  FavoriteGroup,
  ReportItem,
  FacultyMember,
} from '../types.ts';
import {
  INITIAL_USERS,
  INITIAL_CASTING_CALLS,
  INITIAL_APPLICATIONS,
  INITIAL_MESSAGES,
  INITIAL_FAVORITE_GROUPS,
  INITIAL_REPORTS,
  INITIAL_FACULTY,
} from '../data/mockData.ts';

export type CurrentView =
  | 'home'
  | 'search'
  | 'profile'
  | 'casting-calls'
  | 'casting-call-details'
  | 'create-casting-call'
  | 'my-applications'
  | 'applicant-review'
  | 'messages'
  | 'message-details'
  | 'favorites'
  | 'favorite-group-details'
  | 'settings'
  | 'admin'
  | 'about-us'
  | 'contact-us'
  | 'report-user'
  | 'terms'
  | 'login'
  | 'register';

export type SettingsSubTab = 'appearance' | 'notifications' | 'account';
export type AdminSubTab = 'dashboard' | 'reports' | 'users' | 'faculty';

interface AppContextType {
  // Navigation
  currentView: CurrentView;
  setCurrentView: (view: CurrentView) => void;
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  selectedCastingCallId: string;
  setSelectedCastingCallId: (id: string) => void;
  selectedThreadId: string;
  setSelectedThreadId: (id: string) => void;
  selectedFavoriteGroupId: string;
  setSelectedFavoriteGroupId: (id: string) => void;
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
  selectedFacultyId: string | null;
  setSelectedFacultyId: (id: string | null) => void;
  adminSubTab: AdminSubTab;
  setAdminSubTab: (tab: AdminSubTab) => void;
  settingsSubTab: SettingsSubTab;
  setSettingsSubTab: (tab: SettingsSubTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Active Authenticated User Persona
  currentUser: UserProfile;
  switchUserPersona: (userId: string) => void;

  // Entities State & Mutations
  users: UserProfile[];
  toggleFavoriteUser: (userId: string) => void;
  updateUserProfile: (updatedUser: Partial<UserProfile>) => void;

  castingCalls: CastingCall[];
  addCastingCall: (call: Omit<CastingCall, 'id' | 'postedDate'>) => string;

  applications: Application[];
  applyToCastingCall: (callId: string, characterId: string, notes?: string, tapeUrl?: string) => void;
  updateApplicationStage: (appId: string, nextStageIndex: number, newStatus?: Application['status']) => void;
  updateApplicationDecision: (appId: string, decision: Application['decision']) => void;

  messages: MessageThread[];
  sendMessage: (threadId: string, text: string) => void;
  startNewThread: (participantId: string, initialMessage: string) => string;

  favoriteGroups: FavoriteGroup[];
  createFavoriteGroup: (name: string, description?: string) => void;
  toggleUserInGroup: (groupId: string, userId: string) => void;
  deleteFavoriteGroup: (groupId: string) => void;

  reports: ReportItem[];
  submitReport: (report: Omit<ReportItem, 'id' | 'reportNumber' | 'date' | 'status'>) => void;
  updateReportStatus: (reportId: string, status: ReportItem['status'], action?: string, notes?: string) => void;

  faculty: FacultyMember[];
  addFacultyMember: (member: Omit<FacultyMember, 'id'>) => void;
  updateFacultyMember: (id: string, updates: Partial<FacultyMember>) => void;

  // Global modals
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<CurrentView>('home');
  const [selectedUserId, setSelectedUserId] = useState<string>('user-elena');
  const [selectedCastingCallId, setSelectedCastingCallId] = useState<string>('cc-pirates');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('thread-david');
  const [selectedFavoriteGroupId, setSelectedFavoriteGroupId] = useState<string>('fav-1');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [adminSubTab, setAdminSubTab] = useState<AdminSubTab>('dashboard');
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('appearance');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('user-elena');
  const [castingCalls, setCastingCalls] = useState<CastingCall[]>(INITIAL_CASTING_CALLS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [messages, setMessages] = useState<MessageThread[]>(INITIAL_MESSAGES);
  const [favoriteGroups, setFavoriteGroups] = useState<FavoriteGroup[]>(INITIAL_FAVORITE_GROUPS);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [faculty, setFaculty] = useState<FacultyMember[]>(INITIAL_FACULTY);

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const switchUserPersona = (userId: string) => {
    setCurrentUserId(userId);
    const user = users.find((u) => u.id === userId);
    if (user) {
      showNotification(`Switched demo persona to: ${user.name} (${user.role})`);
    }
  };

  const toggleFavoriteUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newState = !u.isFavorited;
          showNotification(newState ? `Added ${u.name} to Favorites` : `Removed ${u.name} from Favorites`);
          return { ...u, isFavorited: newState };
        }
        return u;
      })
    );
  };

  const updateUserProfile = (updatedUser: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updatedUser } : u))
    );
    showNotification('Profile updated successfully');
  };

  const addCastingCall = (callData: Omit<CastingCall, 'id' | 'postedDate'>) => {
    const newId = `cc-${Date.now()}`;
    const newCall: CastingCall = {
      ...callData,
      id: newId,
      postedDate: 'Today',
    };
    setCastingCalls((prev) => [newCall, ...prev]);
    showNotification(`Published casting call: "${newCall.title}"`);
    return newId;
  };

  const applyToCastingCall = (
    callId: string,
    characterId: string,
    notes?: string,
    tapeUrl?: string
  ) => {
    const call = castingCalls.find((c) => c.id === callId);
    if (!call) return;
    const char = call.characters.find((c) => c.id === characterId);
    if (!char) return;

    // Check if already applied
    const existing = applications.find(
      (a) => a.productionId === callId && a.characterId === characterId && a.applicantId === currentUser.id
    );
    if (existing) {
      showNotification('You have already applied for this role!');
      return;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      productionId: call.id,
      productionName: call.title,
      productionType: call.productionType,
      characterId: char.id,
      characterName: char.name,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantAvatar: currentUser.avatarUrl,
      appliedDate: 'Just now',
      currentStageIndex: 0,
      stages: char.workflowStages.length ? char.workflowStages : ['Application', 'Callback', 'Final Audition'],
      status: 'Under Review',
      actionRequired: false,
      stageInstructions: 'Your application has been received and is under review.',
      stageDeadline: call.deadline,
      submissionDetails: {
        note: notes || 'Standard audition submission with headshot and resume.',
        tapeUrl: tapeUrl || currentUser.media.videos[0]?.url,
      },
      decision: 'Pending',
    };

    setApplications((prev) => [newApp, ...prev]);
    // increment character applicantsCount
    setCastingCalls((prev) =>
      prev.map((c) =>
        c.id === callId
          ? {
              ...c,
              characters: c.characters.map((ch) =>
                ch.id === characterId ? { ...ch, applicantsCount: (ch.applicantsCount || 0) + 1 } : ch
              ),
            }
          : c
      )
    );

    showNotification(`Application submitted for ${char.name} in ${call.title}!`);
  };

  const updateApplicationStage = (
    appId: string,
    nextStageIndex: number,
    newStatus?: Application['status']
  ) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const status = newStatus || (nextStageIndex > 0 ? 'Callback Required' : 'Under Review');
          return {
            ...a,
            currentStageIndex: nextStageIndex,
            status,
            actionRequired: status === 'Callback Required',
          };
        }
        return a;
      })
    );
    showNotification('Audition workflow stage updated');
  };

  const updateApplicationDecision = (appId: string, decision: Application['decision']) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, decision } : a))
    );
    showNotification(`Saved casting decision: ${decision}`);
  };

  const sendMessage = (threadId: string, text: string) => {
    if (!text.trim()) return;
    const now = 'Just now';
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: now,
      isMine: true,
    };

    setMessages((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: text.trim(),
            lastMessageTime: now,
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );
  };

  const startNewThread = (participantId: string, initialMessage: string) => {
    const targetUser = users.find((u) => u.id === participantId);
    if (!targetUser) return '';

    // Check existing
    const existing = messages.find((m) => m.participantId === participantId);
    if (existing) {
      if (initialMessage.trim()) {
        sendMessage(existing.id, initialMessage);
      }
      return existing.id;
    }

    const threadId = `thread-${Date.now()}`;
    const newThread: MessageThread = {
      id: threadId,
      participantId: targetUser.id,
      participantName: targetUser.name,
      participantAvatar: targetUser.avatarUrl,
      participantRole: targetUser.role,
      lastMessage: initialMessage,
      lastMessageTime: 'Just now',
      unread: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: initialMessage,
          timestamp: 'Just now',
          isMine: true,
        },
      ],
    };

    setMessages((prev) => [newThread, ...prev]);
    showNotification(`Started message thread with ${targetUser.name}`);
    return threadId;
  };

  const createFavoriteGroup = (name: string, description?: string) => {
    const newGroup: FavoriteGroup = {
      id: `fav-${Date.now()}`,
      name,
      coverImage: '/src/assets/images/hero_ecu_theatre_1793805612830.jpg',
      description: description || 'Curated group of performers & creatives',
      memberIds: [],
      updatedAt: 'Just now',
    };
    setFavoriteGroups((prev) => [...prev, newGroup]);
    showNotification(`Created group "${name}"`);
  };

  const toggleUserInGroup = (groupId: string, userId: string) => {
    setFavoriteGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const exists = g.memberIds.includes(userId);
          const nextMembers = exists ? g.memberIds.filter((id) => id !== userId) : [...g.memberIds, userId];
          return {
            ...g,
            memberIds: nextMembers,
            updatedAt: 'Just now',
          };
        }
        return g;
      })
    );
    showNotification('Group membership updated');
  };

  const deleteFavoriteGroup = (groupId: string) => {
    setFavoriteGroups((prev) => prev.filter((g) => g.id !== groupId));
    showNotification('Favorite group removed');
  };

  const submitReport = (reportData: Omit<ReportItem, 'id' | 'reportNumber' | 'date' | 'status'>) => {
    const newNum = `REP-${1040 + reports.length + 1}`;
    const newReport: ReportItem = {
      ...reportData,
      id: `rep-${Date.now()}`,
      reportNumber: newNum,
      date: 'Today',
      status: 'Open',
    };
    setReports((prev) => [newReport, ...prev]);
    showNotification(`Report submitted (${newNum}). Our faculty committee will review promptly.`);
  };

  const updateReportStatus = (
    reportId: string,
    status: ReportItem['status'],
    action?: string,
    notes?: string
  ) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status,
              adminAction: action !== undefined ? action : r.adminAction,
              adminNotes: notes !== undefined ? notes : r.adminNotes,
            }
          : r
      )
    );
    showNotification('Report status & admin action updated');
  };

  const addFacultyMember = (memberData: Omit<FacultyMember, 'id'>) => {
    const newFaculty: FacultyMember = {
      ...memberData,
      id: `fac-${Date.now()}`,
    };
    setFaculty((prev) => [...prev, newFaculty]);
    showNotification(`Added faculty member: ${memberData.name}`);
  };

  const updateFacultyMember = (id: string, updates: Partial<FacultyMember>) => {
    setFaculty((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    showNotification('Faculty member details updated');
  };

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedUserId,
        setSelectedUserId,
        selectedCastingCallId,
        setSelectedCastingCallId,
        selectedThreadId,
        setSelectedThreadId,
        selectedFavoriteGroupId,
        setSelectedFavoriteGroupId,
        selectedReportId,
        setSelectedReportId,
        selectedFacultyId,
        setSelectedFacultyId,
        adminSubTab,
        setAdminSubTab,
        settingsSubTab,
        setSettingsSubTab,
        searchQuery,
        setSearchQuery,
        currentUser,
        switchUserPersona,
        users,
        toggleFavoriteUser,
        updateUserProfile,
        castingCalls,
        addCastingCall,
        applications,
        applyToCastingCall,
        updateApplicationStage,
        updateApplicationDecision,
        messages,
        sendMessage,
        startNewThread,
        favoriteGroups,
        createFavoriteGroup,
        toggleUserInGroup,
        deleteFavoriteGroup,
        reports,
        submitReport,
        updateReportStatus,
        faculty,
        addFacultyMember,
        updateFacultyMember,
        isCustomizerOpen,
        setIsCustomizerOpen,
        notificationMessage,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
