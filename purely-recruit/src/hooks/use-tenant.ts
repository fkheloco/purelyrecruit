"use client";

import { useOrganization } from "@clerk/nextjs";

export function useTenant() {
  const { organization, isLoaded } = useOrganization();

  return {
    tenantName: organization?.name || null,
    tenantSlug: organization?.slug || null,
    clerkOrgId: organization?.id || null,
    isLoaded,
  };
}
