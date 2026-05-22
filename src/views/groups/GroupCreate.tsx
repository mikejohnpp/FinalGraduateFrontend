import { useState } from "react";
import type { GroupPrivacy } from "@/types/Group";
import GroupCreateForm from "@/components/groups/GroupCreateForm";
import GroupCreatePreview from "@/components/groups/GroupCreatePreview";

export default function GroupCreate() {
  const [groupName, setGroupName] = useState("");
  const [privacy, setPrivacy] = useState<GroupPrivacy>("public");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <GroupCreateForm 
        groupName={groupName}
        privacy={privacy}
        onGroupNameChange={setGroupName}
        onPrivacyChange={setPrivacy}
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
