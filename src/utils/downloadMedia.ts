export async function downloadMedia(url: string, fallbackName: string) {
  if (!url) return;

  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error("Failed to download resource");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;

    const contentDisposition = response.headers.get("content-disposition") || "";
    const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)/i);

    const rawFallbackName = fallbackName?.trim() || "image";
    const fallbackParts = rawFallbackName.split("|");
    const fallbackFileName = fallbackParts.length > 1 ? fallbackParts[1] : fallbackParts[0];

    const fileName = match?.[1]
      ? decodeURIComponent(match[1]).replace(/^['"]|['"]$/g, "")
      : fallbackFileName || "image";

    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Failed to download media", error);
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
