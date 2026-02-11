"use client";

import { useState, useCallback, useRef } from "react";

// Simple debounce implementation without external dependency
export function useSearch(type: "candidates" | "jobs" = "candidates") {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${type}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, [type]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // Set new debounced search
    debounceTimerRef.current = setTimeout(() => search(value), 300);
  };

  return { query, setQuery: handleQueryChange, results, isSearching };
}
