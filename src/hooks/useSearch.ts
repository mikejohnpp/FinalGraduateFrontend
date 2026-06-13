import { useCallback, useEffect, useRef, useState } from "react";
import { API } from "@/common/constants";
import http from "@/lib/http";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";

export interface UserSearchResult {
  id: number;
  name: string;
  nickName: string | null;
  avatar: string | null;
}

export interface GroupSearchResult {
  id: number;
  name: string;
  avatar: string | null;
  memberCount: number;
}

export interface SearchResult {
  users: UserSearchResult[];
  groups: GroupSearchResult[];
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      try {
        const res = await http.get<ApiResultGeneric<SearchResult>>(API.SEARCH, { q });
        if (res?.data) setResults(res.data);
      } catch {
        // aborted or error — silently ignore
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const clear = useCallback(() => {
    setResults(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return { results, loading, search, clear };
}
