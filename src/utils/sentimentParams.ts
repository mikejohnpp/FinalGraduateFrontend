import type {
    SentimentFilter,
    SentimentItemType,
    SentimentLabel,
} from "@/types/interfaces/admin/ISentiment";

const SENTIMENTS: SentimentLabel[] = ["positive", "neutral", "negative"];

/** Đọc bộ lọc cảm xúc từ URLSearchParams. */
export function parseSentimentFilter(params: URLSearchParams): SentimentFilter {
    const filter: SentimentFilter = {};

    const sentiment = params.get("sentiment");
    if (sentiment && SENTIMENTS.includes(sentiment as SentimentLabel)) {
        filter.sentiment = sentiment as SentimentLabel;
    }

    const fromDate = params.get("fromDate");
    if (fromDate) filter.fromDate = fromDate;

    const toDate = params.get("toDate");
    if (toDate) filter.toDate = toDate;

    const minConfidence = params.get("minConfidence");
    if (minConfidence && !Number.isNaN(Number(minConfidence))) {
        filter.minConfidence = Number(minConfidence);
    }

    const maxConfidence = params.get("maxConfidence");
    if (maxConfidence && !Number.isNaN(Number(maxConfidence))) {
        filter.maxConfidence = Number(maxConfidence);
    }

    const keyword = params.get("keyword");
    if (keyword) filter.keyword = keyword;

    const groupId = params.get("groupId");
    if (groupId && !Number.isNaN(Number(groupId))) {
        filter.groupId = Number(groupId);
    }

    const isActive = params.get("isActive");
    if (isActive === "true") filter.isActive = true;
    else if (isActive === "false") filter.isActive = false;

    return filter;
}

/** Chuyển bộ lọc cảm xúc thành object để đưa vào setSearchParams. */
export function sentimentFilterToParams(filter: SentimentFilter): Record<string, string> {
    const params: Record<string, string> = {};
    if (filter.sentiment) params.sentiment = filter.sentiment;
    if (filter.fromDate) params.fromDate = filter.fromDate;
    if (filter.toDate) params.toDate = filter.toDate;
    if (filter.minConfidence !== undefined) params.minConfidence = String(filter.minConfidence);
    if (filter.maxConfidence !== undefined) params.maxConfidence = String(filter.maxConfidence);
    if (filter.keyword) params.keyword = filter.keyword;
    if (filter.groupId !== undefined) params.groupId = String(filter.groupId);
    if (filter.isActive !== undefined) params.isActive = String(filter.isActive);
    return params;
}

/** Đọc type (post|comment) từ query, mặc định "post". */
export function parseItemType(params: URLSearchParams): SentimentItemType {
    return params.get("type") === "comment" ? "comment" : "post";
}
