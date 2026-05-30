import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/HomeFeed";

export default function ContactItem({ contact }: { contact: Contact }) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted">
      <div className="relative shrink-0">
        <Avatar size="sm">
          <AvatarImage src={contact.avatarUrl} />
          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-background",
            contact.isOnline ? "bg-emerald-500" : "bg-muted-foreground",
          )}
        />
      </div>
      <span className="truncate">{contact.name}</span>
    </div>
  );
}
