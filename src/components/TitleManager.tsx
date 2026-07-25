import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { buildDocumentTitle, resolvePageTitle } from "@/hooks/useDocumentTitle";

export default function TitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageName = resolvePageTitle(pathname);
    document.title = buildDocumentTitle(pageName);
  }, [pathname]);

  return null;
}
