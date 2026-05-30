import { useState } from "react";
import type { GroupPrivacy } from "@/types/Group";
import GroupCreateForm from "@/components/groups/GroupCreateForm";
import GroupCreatePreview from "@/components/groups/GroupCreatePreview";
import { useGroupActions } from "@/hooks/useGroup";
import { useNavigate } from "react-router-dom";

export default function GroupCreate() {
  const [groupName, setGroupName] = useState("");
  const [privacy, setPrivacy] = useState<GroupPrivacy>("public");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const { createGroup, loading } = useGroupActions();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    const group = await createGroup({ name: groupName, privacy });
    if (group) {
      navigate(`/groups/${group.id}`);
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
        loading={loading}
      />
      <GroupCreatePreview 
        groupName={groupName}
        privacy={privacy}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />
    </div>
  );
}
