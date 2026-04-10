import type { ApplicationStatus } from "../types";

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getStatusColor = (status: ApplicationStatus): string => {
  const map: Record<ApplicationStatus, string> = {
    Applied: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    "Phone Screen": "bg-amber-500/20 text-amber-300 border-amber-500/30",
    Interview: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    Offer: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    Rejected: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };
  return map[status];
};

export const getColumnAccentColor = (status: ApplicationStatus): string => {
  const map: Record<ApplicationStatus, string> = {
    Applied: "bg-indigo-500",
    "Phone Screen": "bg-amber-500",
    Interview: "bg-sky-500",
    Offer: "bg-emerald-500",
    Rejected: "bg-rose-500",
  };
  return map[status];
};

export const getColumnBgColor = (status: ApplicationStatus): string => {
  const map: Record<ApplicationStatus, string> = {
    Applied: "bg-indigo-500/5",
    "Phone Screen": "bg-amber-500/5",
    Interview: "bg-sky-500/5",
    Offer: "bg-emerald-500/5",
    Rejected: "bg-rose-500/5",
  };
  return map[status];
};
