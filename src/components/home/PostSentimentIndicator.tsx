import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, SmileIcon, FrownIcon, MehIcon } from "lucide-react";
import type { IPost } from "@/types/interfaces/post/IPost";
import type { IPostDetails } from "@/types/interfaces/post/IPostDetails";

export default function PostSentimentIndicator({ post }: { post: IPost | IPostDetails }) {
  if (post.cancelReason) {
    return (
      <TooltipProvider>
        <Tooltip delay={0}>
          <TooltipTrigger className="cursor-help flex items-center text-muted-foreground">
            <InfoIcon className="size-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Không thể phân tích: {post.cancelReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (post.sentiment === null) {
    return null;
  }

  const sentimentConfig: Record<string, { label: string, colorClass: string, Icon: any }> = {
    positive: { label: "Tích cực", colorClass: "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-green-200 dark:border-green-800", Icon: SmileIcon },
    negative: { label: "Tiêu cực", colorClass: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-red-200 dark:border-red-800", Icon: FrownIcon },
    neutral: { label: "Trung lập", colorClass: "bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20 border-gray-200 dark:border-gray-800", Icon: MehIcon },
  };

  const sentimentKey = post.sentiment.toLowerCase();
  const config = sentimentConfig[sentimentKey];

  if (!config) return null;

  const confPercent = post.confidence ? Math.round(post.confidence * 100) : 0;

  return (
    <TooltipProvider>
      <Tooltip delay={0}>
        <TooltipTrigger className="cursor-help">
          <Badge variant="outline" className={`h-5 text-[10px] px-1.5 gap-1 border ${config.colorClass}`}>
            <config.Icon className="size-3" />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Độ tin cậy: {confPercent}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
