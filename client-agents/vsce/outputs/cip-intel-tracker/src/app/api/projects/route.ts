import { NextRequest, NextResponse } from "next/server";
import { getProjects, addProject, updateProject } from "@/lib/store";
import type { CIPProject, Territory, PipelineStage } from "@/lib/types";

/**
 * GET /api/projects
 * Returns projects with optional filtering
 * Query params: territory, agencyId, stage
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const territory = searchParams.get("territory") as Territory | null;
    const agencyId = searchParams.get("agencyId");
    const stage = searchParams.get("stage") as PipelineStage | null;

    // Get projects with filters
    const projects = getProjects({
      territory: territory || undefined,
      agencyId: agencyId || undefined,
      pipelineStage: stage || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        projects,
        total: projects.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Adds a new project
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["agencyId", "name", "description", "territory", "pipelineStage"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Prepare project
    const project: Omit<CIPProject, "id" | "createdAt" | "updatedAt"> = {
      agencyId: body.agencyId,
      name: body.name,
      description: body.description,
      territory: body.territory,
      pipelineStage: body.pipelineStage,
      estimatedValue: body.estimatedValue || undefined,
      estimatedValueNum: body.estimatedValueNum || undefined,
      procurementMethod: body.procurementMethod || undefined,
      fundingSource: body.fundingSource || undefined,
      rfpDeadline: body.rfpDeadline || undefined,
      newsItemIds: body.newsItemIds || [],
      notes: body.notes || "",
    };

    // Add the project
    const newProject = addProject(project);

    if (!newProject) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to add project",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        project: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects
 * Updates a project
 * Body should include: id and fields to update
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate that id is provided
    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: id",
        },
        { status: 400 }
      );
    }

    const { id, ...updates } = body;

    // Update the project
    const updatedProject = updateProject(id, updates);

    if (!updatedProject) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        project: updatedProject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/projects error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project",
      },
      { status: 500 }
    );
  }
}
