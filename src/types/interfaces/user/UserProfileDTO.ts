export interface UserProfileDTO {
  id: number;
  userName: string;
  nickName: string | null;
  avatar: string | null;
  email: string;
  phoneNumber: number | null;
  dateOfBirth: string | null;
  role: string;
  isActive: boolean;
}
