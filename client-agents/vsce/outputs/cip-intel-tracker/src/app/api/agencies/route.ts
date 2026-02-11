import { NextRequest, NextResponse } from "next/server";
import { getAgencies, addAgency } from "@/lib/store";
import type { Agency, Territory } from "@/lib/types";

/**
 * GET /api/agencies
 * Returns agencies with optional territory filter
 * Query params: territory
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const territory = searchParams.get("territory") as Territory | null;

    // Get agencies with optional filter
    const agencies = getAgencies(territory || undefined);

    return NextResponse.json(
      {
        success: true,
        agencies,
        total: agencies.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/agencies error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch agencies",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agencies
 * Adds a new agency
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "shortName", "territory", "website"];
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

    // Prepare agency
    const agency: Omit<Agency, "id" | "createdAt" | "updatedAt"> = {
      name: body.name,
      shortName: body.shortName,
      territory: body.territory,
      capitalProgram: body.capitalProgram || "",
      website: body.website,
      procurementPortal: body.procurementPortal || undefined,
      contactPhone: body.contactPhone || undefined,
      contactEmail: body.contactEmail || undefined,
      dbeGoal: body.dbeGoal || undefined,
      keyProjects: body.keyProjects || [],
      notes: body.notes || undefined,
      newsSources: body.newsSources || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
    };

    // Add the agency
    const newAgency = addAgency(agency);

    if (!newAgency) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to add agency",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        agency: newAgency,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/agencies error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create agency",
      },
      { status: 500 }
    );
  }
}
