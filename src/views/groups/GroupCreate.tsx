import { useState } from "react";
import type { GroupPrivacy } from "@/types/Group";
import GroupCreateForm from "@/components/groups/GroupCreateForm";
import GroupCreatePreview from "@/components/groups/GroupCreatePreview";
import { useGroupActions, useGroupImage } from "@/hooks/useGroup";
import { useCurrentProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";

export default function GroupCreate() {
  const [groupName, setGroupName] = useState("");
  const [privacy, setPrivacy] = useState<GroupPrivacy>("public");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  // Ảnh nhóm (chọn trước khi tạo, upload sau khi tạo xong)
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const { createGroup, loading } = useGroupActions();
  const { uploadAvatar, uploadCover } = useGroupImage();
  const { profile } = useCurrentProfile();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const handleAvatarSelect = (file: File) => {
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!groupName.trim() || submitting) return;
    setSubmitting(true);
    try {
      const group = await createGroup({ name: groupName, privacy });
      if (!group) return;

      // Upload ảnh (nếu có) sau khi nhóm đã được tạo
      if (avatarFile) await uploadAvatar(group.id, avatarFile);
      if (coverFile) await uploadCover(group.id, coverFile);

      navigate(`/groups/${group.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <GroupCreateForm
        groupName={groupName}
        privacy={privacy}
        onGroupNameChange={setGroupName}
        onPrivacyChange={setPrivacy}
        onSubmit={handleCreate}
        loading={loading || submitting}
        creatorName={profile?.userName || profile?.nickName || "Bạn"}
        creatorAvatar={profile?.avatar ?? null}
        onAvatarSelect={handleAvatarSelect}
        onCoverSelect={handleCoverSelect}
      />
      <GroupCreatePreview
        groupName={groupName}
        privacy={privacy}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        avatarPreview={avatarPreview}
        coverPreview={coverPreview}
        creatorName={profile?.userName || profile?.nickName || "Bạn"}
        creatorAvatar={profile?.avatar ?? null}
      />
    </div>
  );
}
