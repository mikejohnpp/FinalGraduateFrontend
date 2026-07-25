/**
 * Trạng thái quan hệ bạn bè giữa currentUser và targetUser.
 * Trả về từ GET /users/friends/status?userId={currentUserId}&targetId={targetUserId}
 */
export type FriendStatus =
  | "FRIENDS"       // Đã là bạn bè
  | "PENDING_SENT"  // Đã gửi lời mời, chờ đối phương phản hồi
  | "PENDING_RECEIVED" // Đối phương đã gửi lời mời cho mình
  | "NOT_FRIENDS";  // Chưa kết bạn

export interface IFriendStatusResponse {
  status: FriendStatus;
  requestId?: number; // Chỉ có khi status là PENDING_SENT hoặc PENDING_RECEIVED
}
