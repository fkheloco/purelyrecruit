import { db } from "@/db";
import { applications, candidates, jobOpenings, notes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { formatDate } from "@/lib/utils";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;

  const [app] = await db.select().from(applications).where(eq(applications.id, appId)).limit(1);
  if (!app) notFound();

  const [candidate] = await db.select().from(candidates).where(eq(candidates.id, app.candidateId)).limit(1);
  const [job] = await db.select().from(jobOpenings).where(eq(jobOpenings.id, app.jobOpeningId)).limit(1);
  const appNotes = await db.select().from(notes).where(eq(notes.applicationId, appId)).orderBy(desc(notes.createdAt));

  return (
    <div>
      <PageHeader
        title={`${candidate?.firstName || ""} ${candidate?.lastName || ""}`}
        description={`Applied for: ${job?.title || "Unknown"}`}
      >
        <StatusBadge status={app.status} />
      </PageHeader>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">AI Scoring Report</h3>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-xs text-gray-500">Module 1: Resume Match</p>
                <p className="mt-1 text-2xl font-bold text-blue-600">{app.scoreModule1 ?? "—"}</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <p className="text-xs text-gray-500">Module 2: Indicators</p>
                <p className="mt-1 text-2xl font-bold text-purple-600">{app.scoreModule2 ?? "—"}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center">
                <p className="text-xs text-gray-500">Module 3: Skills M/R/O</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">{app.scoreModule3 ?? "—"}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm text-gray-500">Final Score</p>
                <div className="flex items-center gap-3">
                  <ScoreBadge score={app.finalScore} size="lg" />
                  {app.aiRecommendation && (
                    <span className="text-sm font-medium capitalize text-gray-700">{app.aiRecommendation.replace("_", " ")}</span>
                  )}
                </div>
              </div>
              {app.missingMandatoryCount && app.missingMandatoryCount > 0 && (
                <div className="text-right">
                  <p className="text-xs text-red-600 font-medium">Missing {app.missingMandatoryCount} mandatory skill(s)</p>
                  <p className="text-xs text-gray-500">{app.missingMandatoryDetails}</p>
                </div>
              )}
            </div>

            {app.aiNotes && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">AI Assessment</p>
                <p className="mt-1 text-sm text-gray-600">{app.aiNotes}</p>
              </div>
            )}

            {app.aiAltPosition && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">Alternative Position Suggestion</p>
                <p className="mt-1 text-sm text-gray-600">{app.aiAltPosition}</p>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Notes ({appNotes.length})</h3>
            {appNotes.length === 0 ? (
              <p className="mt-4 text-sm text-gray-400">No notes yet</p>
            ) : (
              <div className="mt-4 space-y-4">
                {appNotes.map((note) => (
                  <div key={note.id} className="rounded-lg bg-gray-50 p-4">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500 capitalize">{note.authorRole} · {note.visibility}</span>
                      <span className="text-xs text-gray-400">{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Candidate Info</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-gray-500">Email</dt><dd className="font-medium">{candidate?.email}</dd></div>
              <div><dt className="text-gray-500">Phone</dt><dd className="font-medium">{candidate?.phone || "—"}</dd></div>
              <div><dt className="text-gray-500">Title</dt><dd className="font-medium">{candidate?.currentTitle || "—"}</dd></div>
              <div><dt className="text-gray-500">Company</dt><dd className="font-medium">{candidate?.currentCompany || "—"}</dd></div>
              <div><dt className="text-gray-500">Location</dt><dd className="font-medium">{candidate?.locationCity ? `${candidate.locationCity}, ${candidate.locationState}` : "—"}</dd></div>
              <div><dt className="text-gray-500">Experience</dt><dd className="font-medium">{candidate?.yearsExperience ? `${candidate.yearsExperience} years` : "—"}</dd></div>
              <div><dt className="text-gray-500">Applied</dt><dd className="font-medium">{formatDate(app.appliedAt)}</dd></div>
            </dl>
          </div>

          <div className="mt-6 rounded-lg border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Actions</h3>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition">Shortlist</button>
              <button className="w-full rounded-lg bg-[#455E7F] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a5170] transition">Schedule Interview</button>
              <button className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Re-Score with AI</button>
              <button className="w-full rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
