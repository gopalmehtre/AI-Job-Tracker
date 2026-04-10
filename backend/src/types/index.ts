import { Request } from "express";

export interface AuthPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export type ApplicationStatus =
  | "Applied"
  | "Phone Screen"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface ParsedJobDescription {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
  salaryRange?: string;
}

export interface ResumeSuggestion {
  id: string;
  text: string;
}

export interface AIParseResponse {
  parsed: ParsedJobDescription;
  suggestions: ResumeSuggestion[];
}
