import { useEffect } from "react";
import {
    APP_NAME,
    TITLE_SEPARATOR,
    PAGE_TITLES,
    FALLBACK_PAGE_TITLE,
} from "@/config/pageTitles";

function matchScore(pattern: string, pathname: string): number {
    const normalize = (p: string) => (p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p);
    const patternSegs = normalize(pattern).split("/");
    const pathSegs = normalize(pathname).split("/");

    if (patternSegs.length !== pathSegs.length) return -1;

    let staticMatches = 0;
    for (let i = 0; i < patternSegs.length; i++) {
        const pat = patternSegs[i];
        const seg = pathSegs[i];
        if (pat.startsWith(":")) {
            // Tham số động: phải có giá trị (không rỗng)
            if (!seg) return -1;
            continue;
        }
        if (pat !== seg) return -1;
        staticMatches++;
    }
    return staticMatches;
}

export function resolvePageTitle(pathname: string): string | null {
    let best: { name: string | null; score: number } | null = null;

    for (const [pattern, name] of Object.entries(PAGE_TITLES)) {
        const score = matchScore(pattern, pathname);
        if (score < 0) continue;
        if (!best || score > best.score) {
            best = { name, score };
        }
    }

    return best ? best.name : FALLBACK_PAGE_TITLE;
}

export function buildDocumentTitle(pageName: string | null | undefined): string {
    if (!pageName) return APP_NAME;
    return `${pageName}${TITLE_SEPARATOR}${APP_NAME}`;
}

export function useDocumentTitle(
    pageName?: string | null,
    options?: { raw?: boolean },
): void {
    const raw = options?.raw ?? false;

    useEffect(() => {
        const title = raw && pageName ? pageName : buildDocumentTitle(pageName);
        document.title = title;
    }, [pageName, raw]);
}
