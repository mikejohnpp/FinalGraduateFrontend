import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import type React from "react";
import { Badge } from "./ui/badge";

interface ButtonPopoverProps {
  children?: React.ReactNode;
  icon: any;
  label: string;
  title?: string;
  badgeEnable?: boolean;
  badgeContent?: string;
  description?: string;
}

export default function ButtonPopover({
  children,
  icon,
  label,
  badgeEnable = false,
  badgeContent = "",
}: ButtonPopoverProps) {
  const Icon = icon;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            size="icon"
            aria-label={label}
            variant="outline"
            className="relative h-10 w-10 rounded-full"
          >
            {badgeEnable && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
              >
                {badgeContent}
              </Badge>
            )}
            <Icon data-icon="inline-start" />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] p-0 shadow-lg"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
