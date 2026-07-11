import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserResponse } from "@/stores/chatSlice";

interface ListMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  members?: UserResponse[];
}

function ListMemberDialog({ isOpen, onClose, members }: ListMemberDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Danh sách thành viên nhóm</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex max-h-60 flex-col gap-2 overflow-y-auto rounded-md border p-2">
            {members?.length === 0 && (
              <p className="py-2 text-center text-sm text-muted-foreground">Không có thành viên</p>
            )}
            {members?.map((member) => (
              <div
                key={member.id}
                className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback>{member.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="flex-1 text-sm">{member.username}</span>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ListMemberDialog;
