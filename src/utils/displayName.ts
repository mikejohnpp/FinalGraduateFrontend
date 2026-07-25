/**
 * Helper chuẩn hóa hiển thị tên người dùng trên toàn FE.
 * Quy tắc: ưu tiên tên gốc (userName/name) trước, sau đó tới nickName.
 */

/**
 * Tên hiển thị cho profile (UserProfileDTO / Redux user state).
 * Ưu tiên: userName → nickName → fallback.
 */
export function getDisplayName(
    userName?: string | null,
    nickName?: string | null,
    fallback = "Người dùng",
): string {
    return userName || nickName || fallback;
}

/**
 * Tên hiển thị cho tác giả (IAuthor dùng "name" thay cho "userName").
 * Ưu tiên: name → nickName → fallback.
 */
export function getAuthorDisplayName(
    author: { name?: string | null; nickName?: string | null } | null | undefined,
    fallback = "Ai đó",
): string {
    if (!author) return fallback;
    return author.name || author.nickName || fallback;
}
