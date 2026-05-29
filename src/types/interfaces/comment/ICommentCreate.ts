export interface ICommentCreate {
  userId: number;
  content: string;
  parentId?: number | null; // Bỏ qua nếu là comment gốc
}

export interface ICommentUpdate {
  content: string;
}
