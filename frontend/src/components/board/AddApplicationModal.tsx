import { useState, type FormEvent } from "react";
import Modal from "../common/Modal";
import Spinner from "../common/Spinner";
import { useAppDispatch } from "../../hooks/useRedux";
import { createApplication } from "../../store/slices/applicationsSlice";
import api from "../../services/api";
import toast from "react-hot-toast";
import type { AIParseResponse, ResumeSuggestion } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddApplicationModal = ({ isOpen, onClose }: Props) => {
  const dispatch = useAppDispatch();

  // Form fields
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdLink, setJdLink] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [location, setLocation] = useState("");
  const [seniority, setSeniority] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [niceToHaveSkills, setNiceToHaveSkills] = useState<string[]>([]);
  const [resumeSuggestions, setResumeSuggestions] = useState<ResumeSuggestion[]>([]);

  // UI state
  const [isParsing, setIsParsing] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<"paste" | "review">("paste");

  const resetForm = () => {
    setCompany("");
    setRole("");
    setJdLink("");
    setJobDescription("");
    setNotes("");
    setSalaryRange("");
    setLocation("");
    setSeniority("");
    setRequiredSkills([]);
    setNiceToHaveSkills([]);
    setResumeSuggestions([]);
    setIsParsed(false);
    setStep("paste");
  };

  const handleParse = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first");
      return;
    }

    setIsParsing(true);
    try {
      const res = await api.post<AIParseResponse>("/ai/parse", { jobDescription });
      const { parsed, suggestions } = res.data;

      setCompany(parsed.company);
      setRole(parsed.role);
      setLocation(parsed.location);
      setSeniority(parsed.seniority);
      setSalaryRange(parsed.salaryRange ?? "");
      setRequiredSkills(parsed.requiredSkills);
      setNiceToHaveSkills(parsed.niceToHaveSkills);
      setResumeSuggestions(suggestions);
      setIsParsed(true);
      setStep("review");
      toast.success("Job description parsed successfully!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message ?? "Failed to parse job description");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!company || !role) {
      toast.error("Company and role are required");
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(
        createApplication({
          company,
          role,
          jdLink,
          jobDescription,
          notes,
          salaryRange,
          location,
          seniority,
          requiredSkills,
          niceToHaveSkills,
          resumeSuggestions,
        })
      ).unwrap();
      toast.success("Application added!");
      resetForm();
      onClose();
    } catch {
      toast.error("Failed to save application");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Application" size="xl">
      {step === "paste" ? (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Paste Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="input-field min-h-[200px] resize-y font-mono text-xs leading-relaxed"
              placeholder="Paste the full job description here and let AI extract the details..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleParse}
              disabled={isParsing || !jobDescription.trim()}
              className="btn-primary flex items-center gap-2"
            >
              {isParsing ? (
                <>
                  <Spinner size="sm" />
                  Parsing with AI...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Parse with AI
                </>
              )}
            </button>
            <button
              onClick={() => setStep("review")}
              className="btn-secondary"
            >
              Skip — fill manually
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Parsed badge */}
          {isParsed && (
            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              AI parsed — review and edit the details below
            </div>
          )}

          {/* Core fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Company *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="input-field"
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Role *</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field"
                placeholder="Job title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field"
                placeholder="e.g. Remote, New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Seniority</label>
              <input
                type="text"
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="input-field"
                placeholder="e.g. Senior, Mid-level"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="input-field"
                placeholder="e.g. $120k - $150k"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">JD Link</label>
              <input
                type="url"
                value={jdLink}
                onChange={(e) => setJdLink(e.target.value)}
                className="input-field"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Skills */}
          {(requiredSkills.length > 0 || niceToHaveSkills.length > 0) && (
            <div className="space-y-3">
              {requiredSkills.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Required Skills
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {requiredSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs bg-indigo-500/15 text-indigo-300 rounded-lg border border-indigo-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {niceToHaveSkills.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Nice to Have
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {niceToHaveSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs bg-slate-600/30 text-slate-400 rounded-lg border border-slate-600/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resume suggestions */}
          {resumeSuggestions.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                AI Resume Suggestions
              </label>
              <div className="space-y-2">
                {resumeSuggestions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/30 group"
                  >
                    <span className="flex-1 text-sm text-slate-300 leading-relaxed">
                      {s.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(s.text)}
                      className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field min-h-[80px] resize-y"
              placeholder="Any personal notes about this application..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setStep("paste");
              }}
              className="btn-secondary"
            >
              Back
            </button>
            <div className="flex gap-3">
              <button type="button" onClick={handleClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2">
                {isSaving ? <Spinner size="sm" /> : null}
                Save Application
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddApplicationModal;
