import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import type React from "react";

interface ButtonPopoverProps {
  children?: React.ReactNode;
  icon: any;
  label: string;
  title?: string;
  description?: string;
}

export default function ButtonPopover({
  children,
  icon,
  label,
  title,
  description,
}: ButtonPopoverProps) {
  const Icon = icon;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={label}>
            <Icon data-icon="inline-start" />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent className="w-100">
        <PopoverHeader>
          <PopoverTitle>{title}</PopoverTitle>
          <PopoverDescription>{description}</PopoverDescription>
        </PopoverHeader>
        {children}
      </PopoverContent>
    </Popover>
  );
}
