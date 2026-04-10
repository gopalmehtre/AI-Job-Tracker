import { useState, type FormEvent } from "react";
import Modal from "../common/Modal";
import Spinner from "../common/Spinner";
import { useAppDispatch } from "../../hooks/useRedux";
import {
  updateApplication,
  deleteApplication,
} from "../../store/slices/applicationsSlice";
import toast from "react-hot-toast";
import type { Application, ApplicationStatus } from "../../types";
import { formatDate, getStatusColor } from "../../utils/helpers";

interface Props {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
}

const STATUSES: ApplicationStatus[] = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
];

const ApplicationDetailModal = ({ application, isOpen, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Editable fields
  const [company, setCompany] = useState(application.company);
  const [role, setRole] = useState(application.role);
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [jdLink, setJdLink] = useState(application.jdLink ?? "");
  const [notes, setNotes] = useState(application.notes ?? "");
  const [salaryRange, setSalaryRange] = useState(application.salaryRange ?? "");
  const [location, setLocation] = useState(application.location ?? "");
  const [seniority, setSeniority] = useState(application.seniority ?? "");

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dispatch(
        updateApplication({
          id: application._id,
          data: { company, role, status, jdLink, notes, salaryRange, location, seniority },
        })
      ).unwrap();
      toast.success("Application updated!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteApplication(application._id)).unwrap();
      toast.success("Application deleted");
      onClose();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Application" : application.role} size="xl">
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Company</label>
              <input value={company} onChange={(e) => setCompany(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Role</label>
              <input value={role} onChange={(e) => setRole(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="input-field"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Seniority</label>
              <input value={seniority} onChange={(e) => setSeniority(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Salary Range</label>
              <input value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">JD Link</label>
            <input value={jdLink} onChange={(e) => setJdLink(e.target.value)} className="input-field" type="url" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field min-h-[80px] resize-y" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2">
              {isSaving && <Spinner size="sm" />} Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Header info */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-100">{application.company}</h3>
              <p className="text-slate-400 mt-0.5">{application.role}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-lg border ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {application.location && (
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Location</span>
                <p className="text-sm text-slate-300 mt-0.5">{application.location}</p>
              </div>
            )}
            {application.seniority && (
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Seniority</span>
                <p className="text-sm text-slate-300 mt-0.5">{application.seniority}</p>
              </div>
            )}
            {application.salaryRange && (
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Salary</span>
                <p className="text-sm text-slate-300 mt-0.5">{application.salaryRange}</p>
              </div>
            )}
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Applied</span>
              <p className="text-sm text-slate-300 mt-0.5">{formatDate(application.dateApplied)}</p>
            </div>
            {application.jdLink && (
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">JD Link</span>
                <a
                  href={application.jdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-indigo-400 hover:text-indigo-300 mt-0.5 truncate"
                >
                  View posting →
                </a>
              </div>
            )}
          </div>

          {/* Skills */}
          {application.requiredSkills.length > 0 && (
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Required Skills</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {application.requiredSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs bg-indigo-500/15 text-indigo-300 rounded-lg border border-indigo-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {application.niceToHaveSkills.length > 0 && (
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Nice to Have</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {application.niceToHaveSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs bg-slate-600/30 text-slate-400 rounded-lg border border-slate-600/30">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resume suggestions */}
          {application.resumeSuggestions.length > 0 && (
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Resume Suggestions</span>
              <div className="space-y-2 mt-2">
                {application.resumeSuggestions.map((s) => (
                  <div key={s.id} className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/30 group">
                    <span className="flex-1 text-sm text-slate-300 leading-relaxed">{s.text}</span>
                    <button
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
          {application.notes && (
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Notes</span>
              <p className="text-sm text-slate-400 mt-1.5 whitespace-pre-wrap">{application.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-2 border-t border-slate-700/30">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-red-400">Delete this application?</span>
                <button onClick={handleDelete} disabled={isDeleting} className="btn-danger text-xs flex items-center gap-1.5">
                  {isDeleting && <Spinner size="sm" />} Yes, delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger">
                Delete
              </button>
            )}
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              Edit
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ApplicationDetailModal;
