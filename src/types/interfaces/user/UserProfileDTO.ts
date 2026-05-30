export interface UserProfileDTO {
  id: number;
  userName: string;
  nickName: string | null;
  avatar: string | null;
  email: string | null;       // null khi xem profile người khác
  phoneNumber: number | null;  // null khi xem profile người khác
  dateOfBirth: string | null;  // format: "yyyy-MM-dd"
  role: string;
  isActive: boolean;

  // Profile fields
  coverPhoto: string | null;
  friendCount: number;
  bio: string | null;
  location: string | null;
  education: string | null;
  workplace: string | null;
  hometown: string | null;
  relationship: string | null;
  gender: string | null;
  pronouns: string | null;
  language: string | null;
}
