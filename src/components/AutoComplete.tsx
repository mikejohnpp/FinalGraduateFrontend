import { useState, useRef } from "react";
import { SearchIcon, UsersIcon, LayoutIcon, ClockIcon, XIcon, Loader2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearch } from "@/hooks/useSearch";

export default function AutoComplete() {
  const navigate = useNavigate();
  const { results, loading, search, clear } = useSearch();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    search(val);
    setOpen(true);
  };

  const handleFocus = () => setOpen(true);

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setTimeout(() => setOpen(false), 150);
  };

  const handleClear = () => {
    setQuery("");
    clear();
    inputRef.current?.focus();
  };

  const hasResults = results && (results.users.length > 0 || results.groups.length > 0);
  const showDropdown = open && (query.trim() || hasResults || loading);

  return (
    <div ref={containerRef} className="relative w-full" onBlur={handleBlur}>
      {/* Input */}
      <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2">
        {loading ? (
          <Loader2Icon className="size-4 shrink-0 animate-spin text-muted-foreground" />
        ) : (
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
        )}
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Tìm kiếm trên Facebook"
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={handleClear}
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30"
          >
            <XIcon className="size-3" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 z-50 mt-1 w-[340px] overflow-hidden rounded-xl border border-border bg-card shadow-xl animate-in fade-in-0 zoom-in-95">
          {/* Loading skeleton */}
          {loading && !hasResults && (
            <div className="flex flex-col gap-1 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
                  <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && query.trim() && !hasResults && (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
              <SearchIcon className="size-8 opacity-30" />
              <p className="text-sm">Không tìm thấy kết quả cho "{query}"</p>
            </div>
          )}

          {/* Users section */}
          {results && results.users.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                <UsersIcon className="size-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Người dùng
                </span>
              </div>
              {results.users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    navigate(`/profile/${user.id}`);
                    setOpen(false);
                    setQuery("");
                    clear();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
                >
                  <Avatar className="size-9 shrink-0">
                    <AvatarImage src={user.avatar ?? undefined} />
                    <AvatarFallback className="text-xs font-bold">
                      {(user.nickName || user.name).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.nickName || user.name}
                    </p>
                    {user.nickName && (
                      <p className="truncate text-xs text-muted-foreground">@{user.name}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Groups section */}
          {results && results.groups.length > 0 && (
            <div className="pb-2">
              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                <LayoutIcon className="size-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Nhóm
                </span>
              </div>
              {results.groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => {
                    navigate(`/groups/${group.id}`);
                    setOpen(false);
                    setQuery("");
                    clear();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
                >
                  <Avatar className="size-9 shrink-0 rounded-lg">
                    <AvatarImage src={group.avatar ?? undefined} className="object-cover" />
                    <AvatarFallback className="rounded-lg text-xs font-bold">
                      {group.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{group.name}</p>
                    <p className="text-xs text-muted-foreground">Nhóm</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty state (no query) */}
          {!query.trim() && !loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
              <ClockIcon className="size-4" />
              <span className="text-sm">Nhập tên để tìm kiếm người dùng hoặc nhóm</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
