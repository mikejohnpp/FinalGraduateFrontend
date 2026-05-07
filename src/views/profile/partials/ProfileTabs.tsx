import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="bg-background sticky top-[56px] md:top-[60px] z-10 w-full shadow-sm">
      <Separator />
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="h-14 w-full justify-start bg-transparent p-0 rounded-none overflow-x-auto border-none no-scrollbar">
            <TabsTrigger 
              value="posts" 
              className="h-full rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold px-4"
            >
              Bài viết
            </TabsTrigger>
            <TabsTrigger 
              value="about" 
              className="h-full rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold px-4"
            >
              Giới thiệu
            </TabsTrigger>
            <TabsTrigger 
              value="friends" 
              className="h-full rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold px-4"
            >
              Bạn bè
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              className="h-full rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold px-4"
            >
              Ảnh
            </TabsTrigger>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="h-full px-4 flex items-center font-semibold text-muted-foreground hover:bg-muted/50 transition-colors">
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
  )
}
