import { db } from "@/db";
import { applications, jobOpenings, notes } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { getAuthContext } from "@/lib/auth/middleware";
import { CheckCircle, Clock, Users, Zap } from "lucide-react";
import Link from "next/link";

const STATUS_FLOW = [
  { status: "new", label: "Applied", icon: Zap },
  { status: "scored", label: "Scored", icon: CheckCircle },
  { status: "shortlisted", label: "Shortlisted", icon: CheckCircle },
  { status: "interviewing", label: "Interview", icon: Users },
  { status: "offered", label: "Offered", icon: CheckCircle },
  { status: "hired", label: "Hired", icon: CheckCircle },
];

export default async function ApplicationDetailPage({
  params,
}: {
  params: { appId: string };
}) {
  const context = await getAuthContext();

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, params.appId))
    .limit(1);

  if (!application) {
    return <div className="text-center py-12">Application not found</div>;
  }

  // Check authorization
  if (context?.role === "candidate" && context.userId !== application.candidateId) {
    return <div className="text-center py-12">Not authorized</div>;
  }

  // Get job details
  const [job] = await db
    .select()
    .from(jobOpenings)
    .where(eq(jobOpenings.id, application.jobOpeningId))
    .limit(1);

  // Get visible notes (only show notes marked as visible to candidate)
  const candidateNotes = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.applicationId, application.id),
        eq(notes.visibility, "candidate")
      )
    )
    .orderBy(desc(notes.createdAt));

  const currentStatusIndex = STATUS_FLOW.findIndex(
    (s) => s.status === application.status
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {job?.title || "Job Application"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Applied on {new Date(application.appliedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Status</p>
            <StatusBadge status={application.status} />
          </div>
          {application.finalScore !== null && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Score</p>
              <ScoreBadge score={application.finalScore} />
            </div>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Application Progress
        </h2>

        <div className="flex items-center justify-between">
          {STATUS_FLOW.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;

            return (
              <div key={step.status} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-[#3CB3A2] text-white"
                        : "bg-gray-200 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-[#3CB3A2] ring-opacity-30" : ""}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p
                    className={`mt-2 text-xs font-medium text-center ${
                      isCompleted ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {idx < STATUS_FLOW.length - 1 && (
                  <div
                    className={`h-1 w-12 mx-2 ${
                      idx < currentStatusIndex ? "bg-[#3CB3A2]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Job Details */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              Job Details
            </h2>

            {job ? (
              <div className="space-y-6">
                {job.locationCity && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="mt-1 text-gray-900 font-medium">
                      {job.locationCity}, {job.locationState} · {job.locationType}
                    </p>
                  </div>
                )}

                {job.employmentType && (
                  <div>
                    <p className="text-sm text-gray-600">Employment Type</p>
                    <p className="mt-1 text-gray-900 font-medium capitalize">
                      {job.employmentType.replace("_", " ")}
                    </p>
                  </div>
                )}

                {job.salaryMin && job.salaryMax && (
                  <div>
                    <p className="text-sm text-gray-600">Salary Range</p>
                    <p className="mt-1 text-gray-900 font-medium">
                      ${job.salaryMin.toLocaleString()} - $
                      {job.salaryMax.toLocaleString()}
                    </p>
                  </div>
                )}

                {job.description && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">About the Role</p>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                      {job.description}
                    </div>
                  </div>
                )}

                {job.requirements && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Requirements</p>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                      {job.requirements}
                    </div>
                  </div>
                )}

                <Link
                  href={`/candidate/jobs/${job.id}`}
                  className="inline-block text-sm font-medium text-[#3CB3A2] hover:text-[#35a096] transition"
                >
                  View Full Job Posting →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">Job details not available</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Score */}
          {application.finalScore !== null && (
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Your Score</h3>
              <div className="text-center">
                <div className="mb-2">
                  <ScoreBadge score={application.finalScore} />
                </div>
                <p className="text-sm text-gray-600">
                  Out of 100
                </p>
              </div>
            </div>
          )}

          {/* AI Recommendation */}
          {application.aiRecommendation && (
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">
                Assessment Recommendation
              </h3>
              <p className="text-sm text-gray-700 capitalize">
                {application.aiRecommendation.replace("_", " ")}
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="rounded-lg border bg-blue-50 border-blue-200 p-6">
            <h3 className="mb-2 font-semibold text-blue-900">What's Next?</h3>
            {application.status === "new" && (
              <p className="text-sm text-blue-800">
                Your application is being reviewed. We'll notify you once a decision is made.
              </p>
            )}
            {application.status === "scored" && (
              <p className="text-sm text-blue-800">
                Your application has been scored and is being reviewed by the hiring team.
              </p>
            )}
            {application.status === "shortlisted" && (
              <p className="text-sm text-blue-800">
                Great news! You've been shortlisted. The hiring team will be in touch soon.
              </p>
            )}
            {application.status === "interviewing" && (
              <p className="text-sm text-blue-800">
                You're in the interview stage. Check your messages for interview details.
              </p>
            )}
            {application.status === "offered" && (
              <p className="text-sm text-blue-800">
                Congratulations! You've received an offer. Review the details in your messages.
              </p>
            )}
            {application.status === "hired" && (
              <p className="text-sm text-blue-800">
                Welcome aboard! Reach out to your recruiting contact for next steps.
              </p>
            )}
            {application.status === "rejected" && (
              <p className="text-sm text-blue-800">
                Thank you for applying. Unfortunately, we've decided to move forward with other candidates.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recruiter Notes */}
      {candidateNotes.length > 0 && (
        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Recruiter Notes
          </h2>
          <div className="space-y-4">
            {candidateNotes.map((note) => (
              <div key={note.id} className="border-l-4 border-[#3CB3A2] bg-gray-50 p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {note.content}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
