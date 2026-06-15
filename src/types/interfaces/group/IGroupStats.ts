export interface IGroupStats {
  pendingReviews: number;
  reportedContent: number;
  pendingPosts: number;
  memberRequests: number;
  groupStatusViolations: number;
  moderationNotifications: number;
  weeklyPosts: number;
  weeklyPostsChange: number;     // phần trăm thay đổi, e.g. 12.5
  weeklyComments: number;
  weeklyCommentsChange: number;
  weeklyReactions: number;
  weeklyReactionsChange: number;
  activeMembers: number;
  activeMembersChange: number;
  weeklyActivity: { label: string; value: number }[]; // 7 điểm dữ liệu
}
