import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Hand,
  MapPin,
  Home,
  Cake,
  Heart,
  VenusAndMars,
  MessageCircle,
  Globe,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import type { UserProfileDTO } from "@/types/interfaces/user/UserProfileDTO";
import type { IProfileUpdate } from "@/types/interfaces/user/IProfileUpdate";
import EditableRow from "@/components/profile/EditableRow";
import { useUpdateProfile } from "@/hooks/useProfile";

interface ProfileEditPanelProps {
  profile: UserProfileDTO;
  onClose: () => void;
}

export default function ProfileEditPanel({ profile, onClose }: ProfileEditPanelProps) {
  const { update, loading } = useUpdateProfile();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [draft, setDraft] = useState<IProfileUpdate>({
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    education: profile.education ?? "",
    workplace: profile.workplace ?? "",
    hometown: profile.hometown ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
    relationship: profile.relationship ?? "",
    gender: profile.gender ?? "",
    pronouns: profile.pronouns ?? "",
    language: profile.language ?? "",
  });

  const handleEdit = (field: string) => {
    if (activeField !== null) return;
    setActiveField(field);
  };

  const handleCancel = () => setActiveField(null);

  const handleSaveField = (field: string, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setActiveField(null);
  };

  const handleFinalSave = async () => {
    const result = await update(draft);
    if (result) onClose();
  };

  return (
    <Card className="absolute top-full right-0 z-50 mt-2 w-full border shadow-lg md:w-[800px]">
      <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
        <CardTitle className="text-lg font-bold">Chỉnh sửa trang cá nhân</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-8 rounded-full">
          <X className="size-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex max-h-[70vh] flex-col overflow-y-auto p-0 md:flex-row">
        {/* Cột trái: Giới thiệu */}
        <div className="flex-1 p-4 md:border-r">
          <h3 className="mb-3 font-semibold">Giới thiệu</h3>
          <Separator className="mb-4" />

          {activeField === "bio" ? (
            <div className="flex flex-col gap-2 rounded-md border bg-muted/30 p-2">
              <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Hand className="size-5" />
                <span className="font-medium">Giới thiệu về bạn</span>
              </div>
              <Textarea
                value={draft.bio || ""}
                onChange={(e) => setDraft((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Mô tả bản thân..."
                className="h-24 resize-none"
                maxLength={101}
                autoFocus
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{draft.bio?.length || 0}/101</span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCancel}>
                    Hủy
                  </Button>
                  <Button size="sm" onClick={() => setActiveField(null)}>
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`flex flex-col gap-2 rounded-md border p-3 transition-colors ${
                activeField !== null
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-muted/50"
              }`}
              onClick={() => activeField === null && handleEdit("bio")}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Giới thiệu về bạn</span>
                <Badge variant="secondary" className="text-xs font-normal">
                  Công khai ▼
                </Badge>
              </div>
              <p className="py-4 text-center text-sm">
                {draft.bio || "Chưa có thông tin giới thiệu"}
              </p>
            </div>
          )}
        </div>

        {/* Cột phải: Thông tin cá nhân */}
        <div className="flex-1 p-4">
          <h3 className="mb-3 font-semibold">Thông tin cá nhân</h3>
          <Separator className="mb-4" />

          <div className="flex flex-col gap-1">
            <EditableRow
              icon={MapPin}
              label="Vị trí hiện tại"
              value={draft.location}
              placeholder="Thêm vị trí"
              field="location"
              isActive={activeField === "location"}
              isLocked={activeField !== null && activeField !== "location"}
              onEdit={handleEdit}
              onSave={handleSaveField}
              onCancel={handleCancel}
            />
            <EditableRow
              icon={Home}
              label="Quê quán"
              value={draft.hometown}
              placeholder="Thêm quê quán"
              field="hometown"
              isActive={activeField === "hometown"}
              isLocked={activeField !== null && activeField !== "hometown"}
              onEdit={handleEdit}
              onSave={handleSaveField}
              onCancel={handleCancel}
            />
            <EditableRow
              icon={Cake}
              label="Sinh nhật"
              value={draft.dateOfBirth}
              placeholder="Thêm ngày sinh (yyyy-MM-dd)"
              field="dateOfBirth"
              isActive={activeField === "dateOfBirth"}
              isLocked={activeField !== null && activeField !== "dateOfBirth"}
              onEdit={handleEdit}
              onSave={handleSaveField}
              onCancel={handleCancel}
            />
            <EditableRow
              icon={Heart}
              label="Tình trạng mối quan hệ"
              value={draft.relationship}
              placeholder="Thêm tình trạng"
              field="relationship"
              isActive={activeField === "relationship"}
              isLocked={activeField !== null && activeField !== "relationship"}
              onEdit={handleEdit}
              onSave={handleSaveField}
              onCancel={handleCancel}
            />
            <EditableRow
              icon={VenusAndMars}
              label="Giới tính"
              value={draft.gender}
              placeholder="Thêm giới tính"
              field="gender"
              isActive={activeField === "gender"}
              isLocked={activeField !== null && activeField !== "gender"}
              onEdit={handleEdit}
              onSave={handleSaveField}
              onCancel={handleCancel}
            />
            <EditableRow
              icon={MessageCircle}
              label="Danh xưng"
              value={draft.pronouns}
              placeholder="Thêm danh xưng"
              field="pronouns"
              isActive={activeField === "pronouns"}
              isLocked={activeField !== null && activeField !== "pronouns"}
              onEdit={handleEdit}
              onSave={handleSaveField}
              onCancel={handleCancel}
            />
            <EditableRow
              icon={Globe}
              label="Ngôn ngữ"
              value={draft.language}
              placeholder="Thêm ngôn ngữ"
              field="language"
              isActive={activeField === "language"}
              isLocked={activeField !== null && activeField !== "language"}
              onEdit={handleEdit}
              onSave={handleSaveField}
              onCancel={handleCancel}
            />
            <EditableRow
              icon={GraduationCap}
              label="Học vấn"
              value={draft.education}
              placeholder="Thêm trường học"
              field="education"
              isActive={activeField === "education"}
              isLocked={activeField !== null && activeField !== "education"}
              onEdit={handleEdit}
              onSave={handleSaveField}
              onCancel={handleCancel}
            />
            <EditableRow
              icon={Briefcase}
              label="Nơi làm việc"
              value={draft.workplace}
              placeholder="Thêm nơi làm việc"
              field="workplace"
              isActive={activeField === "workplace"}
              isLocked={activeField !== null && activeField !== "workplace"}
              onEdit={handleEdit}
              onSave={handleSaveField}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </CardContent>

      <div className="flex justify-end border-t bg-muted/20 p-4">
        <Button onClick={handleFinalSave} disabled={activeField !== null || loading}>
          {loading ? "Đang lưu..." : "Xác nhận & Lưu thay đổi"}
        </Button>
      </div>
    </Card>
  );
}
