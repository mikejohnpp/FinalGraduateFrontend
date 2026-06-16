export type SentimentLabel = "positive" | "neutral" | "negative";

export type SentimentItemType = "post" | "comment";

/** Số liệu tổng quan đếm theo 3 nhãn cho cả post và comment. */
export interface SentimentOverviewDTO {
    totalPosts: number;
    positivePosts: number;
    neutralPosts: number;
    negativePosts: number;
    totalComments: number;
    positiveComments: number;
    neutralComments: number;
    negativeComments: number;
}

/** Một bản ghi chi tiết (post hoặc comment) trong drill-down. */
export interface SentimentItemDTO {
    type: "POST" | "COMMENT";
    id: number;
    content: string;
    sentiment: SentimentLabel | null;
    confidence: number | null;
    authorId: number;
    authorName: string;
    groupId: number | null;
    groupName: string | null;
    createdAt: string;
}

/** Bộ lọc dùng chung cho overview + items (tất cả optional). */
export interface SentimentFilter {
    sentiment?: SentimentLabel;
    fromDate?: string;
    toDate?: string;
    minConfidence?: number;
    maxConfidence?: number;
    keyword?: string;
    groupId?: number;
}
