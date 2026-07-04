/** Request body cho PUT /users/profile?userId={userId} — partial update */
export interface IProfileUpdate {
  bio?: string; // max 101 ký tự
  location?: string; // max 100 ký tự
  education?: string; // max 200 ký tự
  workplace?: string; // max 200 ký tự
  hometown?: string; // max 100 ký tự
  dateOfBirth?: string; // format: yyyy-MM-dd
  relationship?: string; // max 50 ký tự
  gender?: string; // max 20 ký tự
  pronouns?: string; // max 50 ký tự
  language?: string; // max 50 ký tự
  avatar?: string; // max 1000 ký tự — link ảnh đại diện (Supabase URL)
  coverPhoto?: string; // max 1000 ký tự — link ảnh bìa (Supabase URL)
}

