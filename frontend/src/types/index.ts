export type ApplicationStatus =
  | "Applied"
  | "Phone Screen"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface Application {
  _id: string;
  userId: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: string;
  jdLink?: string;
  jobDescription?: string;
  notes?: string;
  salaryRange?: string;
  location?: string;
  seniority?: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  resumeSuggestions: ResumeSuggestion[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeSuggestion {
  id: string;
  text: string;
}

export interface ParsedJobDescription {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
  salaryRange?: string;
}

export interface AIParseResponse {
  parsed: ParsedJobDescription;
  suggestions: ResumeSuggestion[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ApplicationsState {
  items: Application[];
  isLoading: boolean;
  error: string | null;
}

export const COLUMNS: ApplicationStatus[] = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
];

export const COLUMN_COLORS: Record<ApplicationStatus, string> = {
  Applied: "indigo",
  "Phone Screen": "amber",
  Interview: "sky",
  Offer: "emerald",
  Rejected: "rose",
};
