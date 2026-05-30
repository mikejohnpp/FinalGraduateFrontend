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
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
    onRemove?.(id);
  };

  return (
    <Combobox items={recentSearches} itemToStringValue={(item: SearchItem) => item.title}>
      <div className="relative w-full">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <ComboboxInput
          showTrigger={false}
          placeholder="Tìm kiếm trên Facebook"
          className="w-full rounded-full border-none bg-secondary pl-9 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      <ComboboxContent className="w-[360px] rounded-xl border border-border bg-card p-2 shadow-lg">
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <h3 className="text-base font-semibold">Mới đây</h3>
          <Button variant="link" className="h-auto p-0 font-normal text-primary">
            Chỉnh sửa
          </Button>
        </div>
        <ComboboxEmpty>Không có tìm kiếm gần đây.</ComboboxEmpty>
        <ComboboxList className="max-h-[500px]">
          {(item) => (
            <ComboboxItem
              key={item.id}
              value={item}
              className="cursor-pointer rounded-lg px-2 py-1.5 pr-2 data-highlighted:bg-muted [&>span]:hidden"
              onClick={() => onSelect?.(item)}
              /* [&>span]:hidden disables the CheckIcon indicator from ComboboxItem */
            >
              <Item
                size="sm"
                className="w-full items-center gap-3 border-none bg-transparent p-0 shadow-none"
              >
                <ItemMedia>
                  {item.image ? (
                    <Avatar className="size-10 rounded-lg">
                      <AvatarImage src={item.image} className="object-cover" />
                      <AvatarFallback className="rounded-lg">{item.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : item.icon ? (
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                      <item.icon className="size-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                      <SearchIcon className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </ItemMedia>
                <ItemContent className="flex-1 overflow-hidden py-1">
                  <ItemTitle className="text-[15px] leading-tight font-medium whitespace-normal">
                    {item.title}
                  </ItemTitle>
                  {item.subtitle && (
                    <ItemDescription className="mt-0.5 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                      {item.subtitle.includes("mới") && (
                        <span className="inline-block size-2 shrink-0 rounded-full bg-primary"></span>
                      )}
                      <span className="truncate">{item.subtitle}</span>
                    </ItemDescription>
                  )}
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 rounded-full text-muted-foreground hover:bg-muted"
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
