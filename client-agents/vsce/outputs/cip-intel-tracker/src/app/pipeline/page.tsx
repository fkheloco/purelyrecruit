"use client";

import { useEffect, useState, useRef } from "react";
import {
  getProjects,
  getAgencies,
  addProject,
  updateProject,
  moveProjectStage,
  getNewsItems,
  getAgency,
} from "@/lib/store";
import {
  CIPProject,
  PipelineStage,
  PIPELINE_STAGES,
  ACTIVE_PIPELINE_STAGES,
  Territory,
} from "@/lib/types";
import { formatDate, formatDateRelative, formatCurrency, cn } from "@/lib/utils";
import {
  FolderKanban,
  Plus,
  ChevronRight,
  ChevronDown,
  Clock,
  DollarSign,
  Building2,
  Tag,
  Newspaper,
  ExternalLink,
  X,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  MoreVertical,
} from "lucide-react";

// Stage colors mapping
const STAGE_COLORS: Partial<Record<PipelineStage, string>> & Record<string, string> = {
  cip_identified: "#6366f1",
  monitoring: "#8b5cf6",
  pre_sell: "#a855f7",
  pre_solicitation: "#d946ef",
  solicitation: "#ec4899",
  wheelhouse_review: "#f97316",
  go_no_go: "#eab308",
  proposal: "#22c55e",
  submitted: "#14b8a6",
  awarded: "#10b981",
  not_awarded: "#ef4444",
  no_go: "#9ca3af",
  dumped: "#6b7280",
};

const STAGE_LABELS: Record<string, string> = {
  cip_identified: "CIP Identified",
  monitoring: "Monitoring",
  pre_sell: "Pre-Sell",
  pre_solicitation: "Pre-Solicitation",
  solicitation: "Solicitation",
  wheelhouse_review: "Wheelhouse Review",
  go_no_go: "Go/No-Go",
  proposal: "Proposal",
  submitted: "Submitted",
  awarded: "Awarded",
  not_awarded: "Not Awarded",
  no_go: "No-Go",
  dumped: "Not In Wheelhouse",
};

type ProjectWithDetails = CIPProject & {
  daysInStage: number;
  newsCount: number;
  daysUntilDeadline?: number;
};

export default function PipelinePage() {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | "all">(
    "all"
  );
  const [selectedProject, setSelectedProject] = useState<ProjectWithDetails | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      try {
        const projectsData = getProjects();
        const agenciesData = getAgencies();
        const allNews = getNewsItems();

        // Enrich projects with additional data
        const enrichedProjects = projectsData.map((project) => {
            const newsCount = allNews.items.filter(
              (item) => item.projectId === project.id
            ).length;

            const daysInStage = Math.floor(
              (Date.now() - new Date(project.updatedAt).getTime()) /
                (1000 * 60 * 60 * 24)
            );

            let daysUntilDeadline: number | undefined;
            if (project.rfpDeadline) {
              daysUntilDeadline = Math.ceil(
                (new Date(project.rfpDeadline).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
            }

            return {
              ...project,
              daysInStage,
              newsCount,
              daysUntilDeadline,
            };
          });

        setProjects(enrichedProjects);
        setAgencies(agenciesData);
      } catch (error) {
        console.error("Failed to load pipeline data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const territories = Array.from(
    new Set(agencies.map((a) => a.territory).filter(Boolean))
  ) as Territory[];

  const filteredProjects = projects.filter((p) => {
    if (selectedTerritory === "all") return true;
    const agency = agencies.find((a) => a.id === p.agencyId);
    return agency?.territory === selectedTerritory;
  });

  const projectsByStage = ACTIVE_PIPELINE_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = filteredProjects.filter((p) => p.pipelineStage === stage);
      return acc;
    },
    {} as Record<PipelineStage, ProjectWithDetails[]>
  );

  const handleMoveProject = (
    projectId: string,
    newStage: PipelineStage
  ) => {
    try {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      const updatedProject = moveProjectStage(projectId, newStage);
      if (!updatedProject) return;

      // Update local state
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...updatedProject,
                daysInStage: 0,
                newsCount: p.newsCount,
                daysUntilDeadline: p.daysUntilDeadline,
              } as ProjectWithDetails
            : p
        )
      );

      if (selectedProject?.id === projectId) {
        setSelectedProject({
          ...updatedProject,
          daysInStage: 0,
          newsCount: selectedProject.newsCount,
          daysUntilDeadline: selectedProject.daysUntilDeadline,
        } as ProjectWithDetails);
      }
    } catch (error) {
      console.error("Failed to move project:", error);
    }
  };

  const handleAddProject = (formData: any) => {
    try {
      const newProject = addProject(formData);

      const enrichedProject: ProjectWithDetails = {
        ...newProject,
        daysInStage: 0,
        newsCount: 0,
      };

      setProjects((prev) => [...prev, enrichedProject]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
        <div className="text-[#9898ac]">Loading pipeline...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      {/* Header */}
      <div className="border-b border-[#2a2a3a] bg-[#111119]">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FolderKanban className="w-7 h-7 text-[#6366f1]" />
              <h1 className="text-3xl font-bold">Pipeline</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </button>
          </div>

          {/* Territory Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#9898ac]">Territory:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedTerritory("all")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  selectedTerritory === "all"
                    ? "bg-[#6366f1] text-white"
                    : "bg-[#1a1a25] text-[#9898ac] hover:bg-[#2a2a3a]"
                )}
              >
                All Territories
              </button>
              {territories.map((territory) => (
                <button
                  key={territory}
                  onClick={() => setSelectedTerritory(territory)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    selectedTerritory === territory
                      ? "bg-[#6366f1] text-white"
                      : "bg-[#1a1a25] text-[#9898ac] hover:bg-[#2a2a3a]"
                  )}
                >
                  {territory}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto bg-[#0a0a0f] px-8 py-6"
      >
        <div className="flex gap-6 min-w-fit pb-6">
          {ACTIVE_PIPELINE_STAGES.map((stage) => (
            <div
              key={stage}
              className="flex flex-col flex-shrink-0 w-[280px] bg-[#111119] rounded-lg border border-[#2a2a3a] overflow-hidden"
            >
              {/* Column Header */}
              <div
                className="px-4 py-4 border-b border-[#2a2a3a]"
                style={{
                  backgroundColor: `${STAGE_COLORS[stage]}15`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STAGE_COLORS[stage] }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{STAGE_LABELS[stage]}</h3>
                    <p className="text-xs text-[#6b6b80]">
                      {projectsByStage[stage].length} project
                      {projectsByStage[stage].length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-280px)]">
                {projectsByStage[stage].length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-[#6b6b80] text-sm">
                    No projects
                  </div>
                ) : (
                  projectsByStage[stage].map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      stage={stage}
                      stageColor={STAGE_COLORS[stage] || "#6b7280"}
                      agencies={agencies}
                      onCardClick={() => {
                        setSelectedProject(project);
                        setShowDetailModal(true);
                      }}
                      onMove={(newStage) =>
                        handleMoveProject(project.id, newStage)
                      }
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {showDetailModal && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          agencies={agencies}
          onClose={() => setShowDetailModal(false)}
          onMove={(newStage) => {
            handleMoveProject(selectedProject.id, newStage);
            setShowDetailModal(false);
          }}
        />
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal
          agencies={agencies}
          onClose={() => setShowAddModal(false)}
          onSubmit={(formData) => {
            handleAddProject(formData);
          }}
        />
      )}
    </div>
  );
}

// Project Card Component
function ProjectCard({
  project,
  stage,
  stageColor,
  agencies,
  onCardClick,
  onMove,
}: {
  project: ProjectWithDetails;
  stage: PipelineStage;
  stageColor: string;
  agencies: any[];
  onCardClick: () => void;
  onMove: (stage: PipelineStage) => void;
}) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const agency = agencies.find((a) => a.id === project.agencyId);
  const deadlineColor =
    project.daysUntilDeadline !== undefined
      ? project.daysUntilDeadline < 7
        ? "text-red-400"
        : project.daysUntilDeadline < 14
        ? "text-yellow-400"
        : "text-green-400"
      : "";

  return (
    <div
      onClick={onCardClick}
      className="bg-[#13131d] border border-[#2a2a3a] rounded-lg p-4 cursor-pointer hover:border-[#3a3a4a] hover:bg-[#1a1a25] transition-all group"
      style={{
        borderLeftColor: stageColor,
        borderLeftWidth: "3px",
      }}
    >
      {/* Title */}
      <h4 className="font-semibold text-sm mb-3 line-clamp-2">
        {project.name}
      </h4>

      {/* Agency Badge */}
      <div className="mb-3">
        <span className="inline-block px-2 py-1 bg-[#1a1a25] border border-[#2a2a3a] rounded text-xs text-[#9898ac]">
          {agency?.shortName || agency?.name || "Unknown"}
        </span>
      </div>

      {/* Value */}
      {project.estimatedValue && (
        <div className="flex items-center gap-2 text-xs text-[#9898ac] mb-2">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{project.estimatedValue}</span>
        </div>
      )}

      {/* Days in Stage */}
      <div className="flex items-center gap-2 text-xs text-[#9898ac] mb-2">
        <Clock className="w-3.5 h-3.5" />
        <span>{project.daysInStage} day{project.daysInStage !== 1 ? "s" : ""}</span>
      </div>

      {/* RFP Deadline */}
      {project.rfpDeadline && (
        <div className={cn("flex items-center gap-2 text-xs mb-2", deadlineColor)}>
          <Tag className="w-3.5 h-3.5" />
          <span>
            {project.daysUntilDeadline !== undefined
              ? project.daysUntilDeadline < 0
                ? "Deadline passed"
                : `${project.daysUntilDeadline}d left`
              : formatDate(project.rfpDeadline)}
          </span>
        </div>
      )}

      {/* Procurement Method */}
      {project.procurementMethod && (
        <div className="flex items-center gap-2 text-xs text-[#9898ac] mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>{project.procurementMethod}</span>
        </div>
      )}

      {/* Wheelhouse Status */}
      {stage === "wheelhouse_review" && (
        <div className="flex items-center gap-2 text-xs mb-2">
          {project.inWheelhouse === true && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>In Wheelhouse</span>
            </div>
          )}
          {project.inWheelhouse === false && (
            <div className="flex items-center gap-1 text-red-400">
              <XCircle className="w-3.5 h-3.5" />
              <span>Out of Wheelhouse</span>
            </div>
          )}
          {project.inWheelhouse === undefined && (
            <div className="flex items-center gap-1 text-yellow-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Unsure</span>
            </div>
          )}
        </div>
      )}

      {/* News Items Count */}
      {project.newsCount > 0 && (
        <div className="flex items-center gap-2 text-xs text-[#9898ac] mb-3">
          <Newspaper className="w-3.5 h-3.5" />
          <span>{project.newsCount} news item{project.newsCount !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Move Menu */}
      <div className="relative pt-3 border-t border-[#2a2a3a]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMoveMenu(!showMoveMenu);
          }}
          className="w-full text-left flex items-center justify-between px-2 py-1.5 text-xs text-[#6b6b80] hover:text-[#9898ac] hover:bg-[#1a1a25] rounded transition-colors"
        >
          <span>Move to</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {showMoveMenu && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg shadow-lg z-50">
            {ACTIVE_PIPELINE_STAGES.map((targetStage) => (
              <button
                key={targetStage}
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(targetStage);
                  setShowMoveMenu(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs hover:bg-[#2a2a3a] transition-colors first:rounded-t-lg last:rounded-b-lg",
                  targetStage === stage ? "text-[#6366f1] font-semibold" : "text-[#9898ac]"
                )}
              >
                {STAGE_LABELS[targetStage]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Project Detail Modal
function ProjectDetailModal({
  project,
  agencies,
  onClose,
  onMove,
}: {
  project: ProjectWithDetails;
  agencies: any[];
  onClose: () => void;
  onMove: (stage: PipelineStage) => void;
}) {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const agency = agencies.find((a) => a.id === project.agencyId);

  useEffect(() => {
    const loadNews = () => {
      try {
        const result = getNewsItems();
        setNewsItems(result.items.filter((item) => item.projectId === project.id));
      } catch (error) {
        console.error("Failed to load news items:", error);
      }
    };

    loadNews();
  }, [project.id]);

  const progressPercentage = (ACTIVE_PIPELINE_STAGES.indexOf(project.pipelineStage) / (ACTIVE_PIPELINE_STAGES.length - 1)) * 100;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111119] border border-[#2a2a3a] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#2a2a3a] sticky top-0 bg-[#111119]">
          <div>
            <h2 className="text-2xl font-bold mb-1">{project.name}</h2>
            <p className="text-[#9898ac] text-sm">{agency?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1a1a25] rounded transition-colors"
          >
            <X className="w-5 h-5 text-[#9898ac]" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Pipeline Progress */}
          <div>
            <h3 className="text-sm font-semibold text-[#9898ac] mb-3">
              Pipeline Stage
            </h3>
            <div className="space-y-3">
              <div className="bg-[#1a1a25] rounded-lg p-4 border border-[#2a2a3a]">
                <p className="text-sm font-semibold mb-3" style={{ color: STAGE_COLORS[project.pipelineStage] }}>
                  {STAGE_LABELS[project.pipelineStage]}
                </p>
                <div className="w-full bg-[#0a0a0f] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progressPercentage}%`,
                      backgroundColor: STAGE_COLORS[project.pipelineStage],
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#6b6b80] mt-2">
                  <span>Start</span>
                  <span>Submitted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#6b6b80] mb-1">Estimated Value</p>
              <p className="text-sm font-semibold">
                {project.estimatedValueNum
                  ? formatCurrency(project.estimatedValueNum)
                  : project.estimatedValue || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6b6b80] mb-1">Days in Stage</p>
              <p className="text-sm font-semibold">{project.daysInStage} days</p>
            </div>
            <div>
              <p className="text-xs text-[#6b6b80] mb-1">Procurement Method</p>
              <p className="text-sm font-semibold">
                {project.procurementMethod || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6b6b80] mb-1">Funding Source</p>
              <p className="text-sm font-semibold">{project.fundingSource || "Not set"}</p>
            </div>
          </div>

          {/* RFP Deadline */}
          {project.rfpDeadline && (
            <div>
              <p className="text-xs text-[#6b6b80] mb-2">RFP Deadline</p>
              <p className="text-sm font-semibold">
                {formatDate(project.rfpDeadline)}
                {project.daysUntilDeadline !== undefined && (
                  <span
                    className={cn(
                      "ml-2 text-xs",
                      project.daysUntilDeadline < 7
                        ? "text-red-400"
                        : project.daysUntilDeadline < 14
                        ? "text-yellow-400"
                        : "text-green-400"
                    )}
                  >
                    ({project.daysUntilDeadline} days left)
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div>
              <p className="text-xs text-[#6b6b80] mb-2">Description</p>
              <p className="text-sm text-[#9898ac]">{project.description}</p>
            </div>
          )}

          {/* Wheelhouse Status */}
          {project.pipelineStage === "wheelhouse_review" && (
            <div className="bg-[#1a1a25] rounded-lg p-4 border border-[#2a2a3a]">
              <p className="text-sm font-semibold mb-3">In Our Wheelhouse?</p>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await updateProject(project.id, { inWheelhouse: true });
                  }}
                  className={cn(
                    "flex-1 px-3 py-2 rounded text-sm font-medium transition-colors",
                    project.inWheelhouse === true
                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                      : "bg-[#0a0a0f] text-[#6b6b80] border border-[#2a2a3a] hover:border-green-500/50"
                  )}
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Yes
                </button>
                <button
                  onClick={async () => {
                    await updateProject(project.id, { inWheelhouse: false });
                  }}
                  className={cn(
                    "flex-1 px-3 py-2 rounded text-sm font-medium transition-colors",
                    project.inWheelhouse === false
                      ? "bg-red-500/20 text-red-400 border border-red-500/50"
                      : "bg-[#0a0a0f] text-[#6b6b80] border border-[#2a2a3a] hover:border-red-500/50"
                  )}
                >
                  <XCircle className="w-4 h-4 inline mr-2" />
                  No
                </button>
                <button
                  onClick={async () => {
                    await updateProject(project.id, { inWheelhouse: undefined });
                  }}
                  className={cn(
                    "flex-1 px-3 py-2 rounded text-sm font-medium transition-colors",
                    project.inWheelhouse === undefined
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                      : "bg-[#0a0a0f] text-[#6b6b80] border border-[#2a2a3a] hover:border-yellow-500/50"
                  )}
                >
                  <HelpCircle className="w-4 h-4 inline mr-2" />
                  Unsure
                </button>
              </div>
            </div>
          )}

          {/* Go/No-Go Decision */}
          {project.pipelineStage === "go_no_go" && (
            <div className="bg-[#1a1a25] rounded-lg p-4 border border-[#2a2a3a]">
              <p className="text-sm font-semibold mb-3">Go/No-Go Decision</p>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await updateProject(project.id, { goNoGoDecision: "go" });
                  }}
                  className={cn(
                    "flex-1 px-3 py-2 rounded text-sm font-medium transition-colors",
                    project.goNoGoDecision === "go"
                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                      : "bg-[#0a0a0f] text-[#6b6b80] border border-[#2a2a3a] hover:border-green-500/50"
                  )}
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Go
                </button>
                <button
                  onClick={async () => {
                    await updateProject(project.id, { goNoGoDecision: "no_go" });
                  }}
                  className={cn(
                    "flex-1 px-3 py-2 rounded text-sm font-medium transition-colors",
                    project.goNoGoDecision === "no_go"
                      ? "bg-red-500/20 text-red-400 border border-red-500/50"
                      : "bg-[#0a0a0f] text-[#6b6b80] border border-[#2a2a3a] hover:border-red-500/50"
                  )}
                >
                  <XCircle className="w-4 h-4 inline mr-2" />
                  No-Go
                </button>
              </div>
            </div>
          )}

          {/* News Items */}
          {newsItems.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Related News ({newsItems.length})
              </p>
              <div className="space-y-2">
                {newsItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-[#1a1a25] border border-[#2a2a3a] rounded hover:border-[#3a3a4a] transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 group-hover:text-[#6366f1]">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#6b6b80] mt-1">
                          {item.source} • {formatDateRelative(item.publishedAt)}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#6b6b80] group-hover:text-[#6366f1] flex-shrink-0 mt-0.5" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Move Stage Button */}
          <div className="pt-4 border-t border-[#2a2a3a]">
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  const currentIndex = ACTIVE_PIPELINE_STAGES.indexOf(project.pipelineStage);
                  if (currentIndex < ACTIVE_PIPELINE_STAGES.length - 1) {
                    const nextStage = ACTIVE_PIPELINE_STAGES[currentIndex + 1];
                    onMove(nextStage);
                  }
                }}
                disabled={
                  ACTIVE_PIPELINE_STAGES.indexOf(project.pipelineStage) ===
                  ACTIVE_PIPELINE_STAGES.length - 1
                }
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] disabled:bg-[#2a2a3a] disabled:text-[#6b6b80] rounded-lg font-medium transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                Advance Stage
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-[#1a1a25] hover:bg-[#2a2a3a] border border-[#2a2a3a] rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Project Modal
function AddProjectModal({
  agencies,
  onClose,
  onSubmit,
}: {
  agencies: any[];
  onClose: () => void;
  onSubmit: (formData: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    agencyId: "",
    estimatedValue: "",
    procurementMethod: "",
    fundingSource: "",
    stage: "cip_identified" as PipelineStage,
    notes: "",
  });

  const selectedAgency = agencies.find((a) => a.id === formData.agencyId);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111119] border border-[#2a2a3a] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a3a] sticky top-0 bg-[#111119]">
          <h2 className="text-2xl font-bold">Add New Project</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1a1a25] rounded transition-colors"
          >
            <X className="w-5 h-5 text-[#9898ac]" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Project Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#6366f1]"
              placeholder="Enter project name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#6366f1] resize-none h-24"
              placeholder="Enter project description"
            />
          </div>

          {/* Agency Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Agency *</label>
            <select
              value={formData.agencyId}
              onChange={(e) =>
                setFormData({ ...formData, agencyId: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg text-[#e8e8f0] focus:outline-none focus:border-[#6366f1]"
            >
              <option value="">Select an agency</option>
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Territory (Auto-set) */}
          {selectedAgency && (
            <div>
              <label className="block text-sm font-medium mb-2">Territory</label>
              <input
                type="text"
                value={selectedAgency.territory || ""}
                disabled
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg text-[#6b6b80] cursor-not-allowed"
              />
            </div>
          )}

          {/* Estimated Value */}
          <div>
            <label className="block text-sm font-medium mb-2">Estimated Value</label>
            <input
              type="number"
              value={formData.estimatedValue}
              onChange={(e) =>
                setFormData({ ...formData, estimatedValue: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#6366f1]"
              placeholder="0"
            />
          </div>

          {/* Procurement Method */}
          <div>
            <label className="block text-sm font-medium mb-2">Procurement Method</label>
            <input
              type="text"
              value={formData.procurementMethod}
              onChange={(e) =>
                setFormData({ ...formData, procurementMethod: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#6366f1]"
              placeholder="e.g., Open Competition, IDIQ"
            />
          </div>

          {/* Funding Source */}
          <div>
            <label className="block text-sm font-medium mb-2">Funding Source</label>
            <input
              type="text"
              value={formData.fundingSource}
              onChange={(e) =>
                setFormData({ ...formData, fundingSource: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#6366f1]"
              placeholder="e.g., Federal, State, Local"
            />
          </div>

          {/* Pipeline Stage */}
          <div>
            <label className="block text-sm font-medium mb-2">Starting Stage</label>
            <select
              value={formData.stage}
              onChange={(e) =>
                setFormData({ ...formData, stage: e.target.value as PipelineStage })
              }
              className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg text-[#e8e8f0] focus:outline-none focus:border-[#6366f1]"
            >
              {ACTIVE_PIPELINE_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {STAGE_LABELS[stage]}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#6366f1] resize-none h-20"
              placeholder="Any additional notes"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4 border-t border-[#2a2a3a]">
            <button
              onClick={() => {
                if (formData.name && formData.agencyId) {
                  const agency = agencies.find((a) => a.id === formData.agencyId);
                  onSubmit({
                    agencyId: formData.agencyId,
                    name: formData.name,
                    description: formData.description,
                    territory: agency?.territory || "socal",
                    pipelineStage: formData.stage,
                    estimatedValue: formData.estimatedValue || undefined,
                    procurementMethod: formData.procurementMethod || undefined,
                    fundingSource: formData.fundingSource || undefined,
                    notes: formData.notes,
                    newsItemIds: [],
                  });
                }
              }}
              disabled={!formData.name || !formData.agencyId}
              className="flex-1 px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] disabled:bg-[#2a2a3a] disabled:text-[#6b6b80] rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Project
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#1a1a25] hover:bg-[#2a2a3a] border border-[#2a2a3a] rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
