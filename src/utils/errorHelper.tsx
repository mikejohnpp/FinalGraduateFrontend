import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";

export type ParsedErrorRes = Record<string, string> | string;

export function parseResDataOrMessage(res: ApiResultGeneric<unknown>): ParsedErrorRes {
  const { data, message } = res ?? {};

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const record = Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => {
        if (typeof value === "string") return [key, value];
        if (Array.isArray(value)) return [key, value.map(String).join(", ")];
        if (value == null) return [key, ""];
        return [key, String(value)];
      }),
    ) as Record<string, string>;

    return record;
  }

  return message ?? "Có lỗi xảy ra";
}

export function isParsedErrorRecord(error: ParsedErrorRes): error is Record<string, string> {
  return typeof error === "object" && error !== null && !Array.isArray(error);
}

export function getParsedErrorValue(
  error: ParsedErrorRes | undefined,
  key: string,
  fallback = "",
): string {
  if (error) {
    if (!isParsedErrorRecord(error)) return fallback;
    return error[key] ?? fallback;
  }

  return fallback;
}

export function getParsedErrorValues(error: ParsedErrorRes): string[] {
  return isParsedErrorRecord(error) ? Object.values(error) : [];
}
