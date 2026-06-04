import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import friendService from "@/services/friendService";
import chatService from "@/services/chatService";
import { useDispatch } from "react-redux";
import chatSlice from "@/stores/chatSlice";
import type { MessageChat } from "@/stores/chatSlice";
import { toast } from "sonner";

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  chatInfo: MessageChat;
}

export default function AddMemberDialog({
  isOpen,
  onClose,
  userId,
  chatInfo,
}: AddMemberDialogProps) {
  const dispatch = useDispatch();
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      friendService
        .getFriends(userId)
        .then((res) => {
          if (res?.data?.data) {
            // Lọc ra những người chưa có trong nhóm
            const currentMemberIds = new Set(chatInfo.members.map((m: any) => m.id));
            const availableFriends = res.data.data.filter(
              (f: any) => !currentMemberIds.has(f.user.id),
            );
            setFriends(availableFriends);
          }
        })
        .catch((err) => console.error(err));
      setSelectedFriends(new Set());
    }
  }, [isOpen, userId, chatInfo]);

  const toggleFriend = (friendId: number) => {
    const newSet = new Set(selectedFriends);
    if (newSet.has(friendId)) {
      newSet.delete(friendId);
    } else {
      newSet.add(friendId);
    }
    setSelectedFriends(newSet);
  };

  const handleAdd = async () => {
    if (selectedFriends.size < 1) return;
    setIsLoading(true);
    try {
      await chatService.addMembersToGroup(
        chatInfo.conversationId,
        Array.from(selectedFriends),
        userId,
      );
      onClose();
      toast.success("Thêm thành viên thành công!");

      // Lấy lại chi tiết chat và cập nhật Redux để không cần reload
      const res = await chatService.getConversationDetail(chatInfo.conversationId, 0, 50);
      if (res?.data) {
        dispatch(chatSlice.actions.setChatList(res.data as MessageChat));
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi thêm thành viên.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm thành viên</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex max-h-60 flex-col gap-2 overflow-y-auto rounded-md border p-2">
            {friends.length === 0 && (
              <p className="py-2 text-center text-sm text-muted-foreground">
                Không có bạn bè nào để thêm
              </p>
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
          <Button onClick={handleAdd} disabled={isLoading || selectedFriends.size < 1}>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
