"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function useRole() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const meta = user.publicMetadata as any;
      setRole(meta?.role || "candidate");
    }
  }, [isLoaded, user]);

  return { role, isLoaded };
}
