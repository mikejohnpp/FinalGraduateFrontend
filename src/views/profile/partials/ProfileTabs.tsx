import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="sticky top-[56px] z-10 w-full bg-background shadow-sm md:top-[60px]">
      <Separator />
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="no-scrollbar h-14 w-full justify-start overflow-x-auto rounded-none border-none bg-transparent p-0">
            <TabsTrigger
              value="posts"
              className="h-full rounded-none border-b-4 border-transparent px-4 font-semibold data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Bài viết
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="h-full rounded-none border-b-4 border-transparent px-4 font-semibold data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Giới thiệu
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="h-full rounded-none border-b-4 border-transparent px-4 font-semibold data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Bạn bè
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="h-full rounded-none border-b-4 border-transparent px-4 font-semibold data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Ảnh
            </TabsTrigger>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-full items-center px-4 font-semibold text-muted-foreground transition-colors hover:bg-muted/50">
                Xem thêm
                <ChevronDown className="ml-1 size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Video</DropdownMenuItem>
                <DropdownMenuItem>Check-in</DropdownMenuItem>
                <DropdownMenuItem>Thể thao</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
