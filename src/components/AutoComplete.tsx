import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemMedia,
  ItemActions,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClockIcon, SearchIcon, XIcon } from "lucide-react";

export type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string; // Optional image/avatar
  icon?: React.ElementType; // Optional icon like Clock
  type: "history" | "page" | "group" | "friend";
};

const initialRecentSearches: SearchItem[] = [
  {
    id: "1",
    title: "Hội Đuông Dừa Miền Bắc",
    subtitle: "9+ thông tin mới",
    image: "https://images.unsplash.com/photo-1506744626753-1fa44f4a311b?w=100&h=100&fit=crop",
    type: "group",
  },
  {
    id: "2",
    title: "Hội Nuôi Đuông Dừa Miền Bắc (Nhóm Chính)",
    subtitle: "9+ thông tin mới",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=100&h=100&fit=crop",
    type: "group",
  },
  {
    id: "3",
    title: "giáo xứ lai ổn",
    icon: ClockIcon,
    type: "history",
  },
  {
    id: "4",
    title: "trung tâm tiếng anh",
    icon: ClockIcon,
    type: "history",
  },
  {
    id: "5",
    title: "Đuông dừa Đồng nai miền Nam",
    subtitle: "1 thông tin mới",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop",
    type: "group",
  },
  {
    id: "6",
    title: "Trung tâm ngoại ngữ Nông Lâm TP.HCM",
    subtitle: "Cao đẳng & Đại học · 1...",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop",
    type: "page",
  },
];

export interface AutoCompleteProps {
  recentSearches?: SearchItem[];
  onSelect?: (item: SearchItem) => void;
  onRemove?: (id: string) => void;
  onSearch?: (query: string) => void;
}

export default function AutoComplete({
  recentSearches: initialSearches = initialRecentSearches,
  onSelect,
  onRemove,
  onSearch,
}: AutoCompleteProps) {
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>(initialSearches);

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setRecentSearches(prev => prev.filter(item => item.id !== id));
    onRemove?.(id);
  };

  return (
    <Combobox
      items={recentSearches}
      itemToStringValue={(item: SearchItem) => item.title}
    >
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10 pointer-events-none" />
        <ComboboxInput 
          showTrigger={false} 
          placeholder="Tìm kiếm trên Facebook" 
          className="pl-9 w-full rounded-full bg-secondary border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" 
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      <ComboboxContent className="w-[360px] p-2 bg-card rounded-xl border border-border shadow-lg">
        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          <h3 className="font-semibold text-base">Mới đây</h3>
          <Button variant="link" className="h-auto p-0 font-normal text-primary">Chỉnh sửa</Button>
        </div>
        <ComboboxEmpty>Không có tìm kiếm gần đây.</ComboboxEmpty>
        <ComboboxList className="max-h-[500px]">
          {(item) => (
            <ComboboxItem 
              key={item.id} 
              value={item} 
              className="px-2 py-1.5 rounded-lg data-highlighted:bg-muted cursor-pointer pr-2 [&>span]:hidden" 
              onClick={() => onSelect?.(item)}
              /* [&>span]:hidden disables the CheckIcon indicator from ComboboxItem */
            >
              <Item size="sm" className="p-0 w-full bg-transparent border-none shadow-none gap-3 items-center">
                <ItemMedia>
                  {item.image ? (
                    <Avatar className="size-10 rounded-lg">
                      <AvatarImage src={item.image} className="object-cover" />
                      <AvatarFallback className="rounded-lg">{item.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : item.icon ? (
                    <div className="size-9 rounded-full bg-muted flex items-center justify-center">
                      <item.icon className="size-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="size-9 rounded-full bg-muted flex items-center justify-center">
                      <SearchIcon className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </ItemMedia>
                <ItemContent className="flex-1 overflow-hidden py-1">
                  <ItemTitle className="whitespace-normal text-[15px] font-medium leading-tight">
                    {item.title}
                  </ItemTitle>
                  {item.subtitle && (
                    <ItemDescription className="text-[13px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      {item.subtitle.includes('mới') && <span className="size-2 rounded-full bg-primary inline-block shrink-0"></span>}
                      <span className="truncate">{item.subtitle}</span>
                    </ItemDescription>
                  )}
                </ItemContent>
                <ItemActions>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-8 rounded-full text-muted-foreground hover:bg-muted shrink-0"
                    onClick={(e) => handleRemove(e, item.id)}
                  >
                    <XIcon className="size-4" />
                  </Button>
                </ItemActions>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
