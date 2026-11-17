export type UserRole = 'Performer' | 'Director' | 'Performer & Director';

export interface Credit {
  id: string;
  title: string;
  role: string;
  venueOrCompany: string;
  director: string;
  year: string;
  type: 'theatre' | 'film' | 'commercial' | 'workshop';
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export interface MediaItem {
  id: string;
  type: 'video' | 'photo' | 'audio';
  title: string;
  url: string;
  thumbnailUrl?: string;
  category?: string;
}

export type LanguageProficiencyLevel =
  | 'Native / Fluent'
  | 'Conversational Proficiency'
  | 'Practiced Performance Dialect';

export interface LanguageDialectEntry {
  id: string;
  name: string;
  proficiency: LanguageProficiencyLevel;
  notes?: string;
}

export interface BodyModifications {
  tattoos?: string;
  piercings?: string;
  notes?: string;
}

export interface Characteristics {
  height?: string;
  vocalRange?: string;
  eyeColor?: string;
  hairColor?: string;
  gender?: string;
  raceEthnicity?: string;
  ageRange?: string;
  unionStatus?: string;
  bodyModifications?: BodyModifications;
  nudityComfort?: string;
  intimacyNotes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  location: string;
  availability: 'Available' | 'Auditioning' | 'Booked Spring 2026' | 'Limited Availability';
  sites: {
    website?: string;
    imdb?: string;
    instagram?: string;
    reelUrl?: string;
  };
  about: string;
  characteristics: Characteristics;
  languagesAndDialects?: LanguageDialectEntry[];
  specialSkills: string[];
  previousRoles: string[];
  resume: {
    performerCredits: Credit[];
    directorCredits: Credit[];
    education: EducationItem[];
  };
  media: {
    videos: MediaItem[];
    photos: string[];
  };
  isFavorited?: boolean;
  isAdmin?: boolean;
  isFaculty?: boolean;
  dateEnrolled?: string;
  category?: string;
  status: 'Active' | 'Review' | 'Suspended';
}

export interface CharacterRole {
  id: string;
  name: string;
  synopsis: string;
  workflowStages: string[];
  applicantsCount?: number;
}

export interface CastingCall {
  id: string;
  title: string;
  productionType: 'Musical' | 'Play' | 'Short Film' | 'Student Showcase' | 'Senior Thesis';
  directorId: string;
  directorName: string;
  producer: string;
  writer: string;
  castingDirector: string;
  shootDays: string;
  rateOfPay: string;
  location: string;
  deadline: string;
  specialSkills: string;
  storyline: string;
  postedDate: string;
  status: 'Open' | 'In Auditions' | 'Cast' | 'Draft';
  characters: CharacterRole[];
}

export interface Application {
  id: string;
  productionId: string;
  productionName: string;
  productionType: string;
  characterId: string;
  characterName: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  appliedDate: string;
  currentStageIndex: number;
  stages: string[];
  status: 'Under Review' | 'Callback Required' | 'Offered' | 'Accepted' | 'Declined';
  stageInstructions?: string;
  stageDeadline?: string;
  actionRequired?: boolean;
  submissionDetails?: {
    note?: string;
    tapeUrl?: string;
    resumeLink?: string;
  };
  decision?: 'Advance' | 'Reject' | 'Shortlist' | 'Cast' | 'Pending';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

export interface MessageThread {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: ChatMessage[];
}

export interface FavoriteGroup {
  id: string;
  name: string;
  coverImage: string;
  description?: string;
  memberIds: string[];
  updatedAt: string;
}

export interface ReportItem {
  id: string;
  reportNumber: string;
  date: string;
  type: 'Inappropriate Content' | 'Harassment' | 'Fake Profile' | 'Audition Policy Violation' | 'Spam';
  reportedTarget: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: 'Open' | 'In Review' | 'Resolved' | 'Dismissed';
  evidence?: string;
  adminAction?: string;
  adminNotes?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  isAdmin: boolean;
  status: 'Active' | 'On Leave';
}

export type ThemePresetId = 
  | 'white-purple'
  | 'ecu-velvet' 
  | 'pirate-gold' 
  | 'midnight-theatre' 
  | 'collegiate-slate' 
  | 'broadway-lights' 
  | 'clean-canvas'
  | 'custom';

export interface BackgroundSettings {
  presetId: ThemePresetId;
  mode: 'preset' | 'color' | 'gradient' | 'image';
  purpleShade?: 'royal' | 'electric' | 'velvet' | 'vintage';
  solidColor?: string;
  gradientAngle?: number;
  gradientStart?: string;
  gradientEnd?: string;
  imageUrl?: string;
  overlayOpacity: number; // 0 to 0.8
  blurAmount: number; // 0 to 20 px
  isDarkTheme: boolean;
}
