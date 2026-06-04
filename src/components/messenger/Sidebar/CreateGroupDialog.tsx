import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import friendService from "@/services/friendService";
import chatService from "@/services/chatService";
import { toast } from "sonner";

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSuccess?: () => void;
}

export default function CreateGroupDialog({ isOpen, onClose, userId, onSuccess }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      friendService
        .getFriends(userId)
        .then((res: any) => {
          console.log("Friends:", res?.data?.data);
          if (res?.data?.data) {
            setFriends(res.data.data);
          }
        })
        .catch((err) => console.error(err));
      setGroupName("");
      setSelectedFriends(new Set());
    }
  }, [isOpen, userId]);

  const toggleFriend = (friendId: number) => {
    const newSet = new Set(selectedFriends);
    if (newSet.has(friendId)) {
      newSet.delete(friendId);
    } else {
      newSet.add(friendId);
    }
    setSelectedFriends(newSet);
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedFriends.size < 1) return;
    setIsLoading(true);
    try {
      await chatService.createGroupConversation(groupName, Array.from(selectedFriends), userId);
      onClose();
      toast.success("Tạo nhóm thành công!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tạo nhóm.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo nhóm mới</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            placeholder="Tên nhóm..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="flex max-h-60 flex-col gap-2 overflow-y-auto rounded-md border p-2">
            {friends.length === 0 && (
              <p className="py-2 text-center text-sm text-muted-foreground">Không có bạn bè</p>
            )}
            {friends.map((friend) => (
              <div
                key={friend.user.id}
                className={`flex cursor-pointer items-center gap-3 rounded-md p-2 ${selectedFriends.has(friend.user.id) ? "bg-muted" : "hover:bg-muted/50"}`}
                onClick={() => toggleFriend(friend.user.id)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.user.avatar} />
                  <AvatarFallback>{friend.user.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="flex-1 text-sm">{friend.user.name}</span>
                <input
                  type="checkbox"
                  checked={selectedFriends.has(friend.user.id)}
                  readOnly
                  className="pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isLoading || !groupName.trim() || selectedFriends.size < 1}
          >
            Tạo nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
