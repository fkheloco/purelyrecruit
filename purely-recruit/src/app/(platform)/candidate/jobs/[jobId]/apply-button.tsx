"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  candidateId?: string;
}

export default function JobApplyButton({
  jobId,
  jobTitle,
  candidateId,
}: ApplyButtonProps) {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  async function handleApply() {
    if (!candidateId) {
      setError("Please sign in to apply");
      return;
    }

    try {
      setApplying(true);
      setError("");

      // First, get the candidate's tenant (they might be associated with a tenant)
      // For now, we'll use the candidate's ID as tenantId since candidates are independent
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId,
          jobOpeningId: jobId,
          // Note: In a real system, we'd need to get the correct tenantId
          // For now, this will be handled by the API based on the job's tenantId
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
      }

      setApplied(true);
      setTimeout(() => {
        // Redirect to applications page
        window.location.href = "/candidate/applications";
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply");
    } finally {
      setApplying(false);
    }
  }

  if (applied) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-4">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="font-medium text-green-900">Application Submitted!</p>
        </div>
        <p className="text-sm text-green-700">
          Redirecting to your applications...
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleApply}
        disabled={applying}
        className="w-full px-6 py-3 bg-[#3CB3A2] text-white font-semibold rounded-lg hover:bg-[#35a096] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {applying ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Apply Now
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs font-medium text-blue-900 mb-2">Why apply?</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>✓ AI-powered matching</li>
          <li>✓ Quick application process</li>
          <li>✓ Real-time status updates</li>
        </ul>
      </div>
    </div>
  );
}
