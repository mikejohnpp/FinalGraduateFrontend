import { useParams } from "react-router-dom";
import { useGroupMemberRequests } from "@/hooks/useGroupAdmin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, UserX, SlidersHorizontal, X } from "lucide-react";
import { formatYear } from "@/utils/stringHelper";

export default function GroupMemberRequests() {
  const { groupId } = useParams<{ groupId: string }>();
  const {
    members,
    loading,
    approve,
    reject,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    genderFilter,
    setGenderFilter,
    loadMore,
    hasNext,
  } = useGroupMemberRequests(groupId || "");

  const hasActiveFilters = searchQuery !== "" || sortOrder !== "newest" || genderFilter !== "ALL";

  const clearFilters = () => {
    setSearchQuery("");
    setSortOrder("newest");
    setGenderFilter("ALL");
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Yêu cầu làm thành viên</h1>
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <SlidersHorizontal className="size-5" />
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <X className="size-4 mr-1" /> Xóa bộ lọc
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="secondary" size="sm" className="rounded-full bg-muted">
                Thời gian yêu cầu <ChevronDown className="size-3 ml-1" />
              </Button>} />
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOrder("newest")} className={sortOrder === "newest" ? "bg-accent" : ""}>
                Mới nhất trước
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")} className={sortOrder === "oldest" ? "bg-accent" : ""}>
                Cũ nhất trước
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="secondary" size="sm" className="rounded-full bg-muted">
                Giới tính {genderFilter !== "ALL" && `(${genderFilter === "MALE" ? "Nam" : genderFilter === "FEMALE" ? "Nữ" : "Khác"})`} <ChevronDown className="size-3 ml-1" />
              </Button>} />
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setGenderFilter("ALL")} className={genderFilter === "ALL" ? "bg-accent" : ""}>
                Tất cả
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGenderFilter("MALE")} className={genderFilter === "MALE" ? "bg-accent" : ""}>
                Nam
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGenderFilter("FEMALE")} className={genderFilter === "FEMALE" ? "bg-accent" : ""}>
                Nữ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="secondary" size="sm" className="rounded-full bg-muted">
                Ngày tham gia <ChevronDown className="size-3 ml-1" />
              </Button>} />
            <DropdownMenuContent>
              <DropdownMenuItem>Bất kỳ</DropdownMenuItem>
              <DropdownMenuItem>Dưới 1 năm</DropdownMenuItem>
              <DropdownMenuItem>1-3 năm</DropdownMenuItem>
              <DropdownMenuItem>Trên 3 năm</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </Card>
          ))
        ) : members.length > 0 ? (
          members.map((member) => (
            <Card key={member.id} className="p-4 shadow-sm hover:border-border transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="size-12">
                    <AvatarImage src={member.avatarUrl} alt={member.username} />
                    <AvatarFallback>{member.username.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{member.username}</span>
                    <span className="text-xs text-muted-foreground">
                      Đã tham gia nền tảng từ {member.joinedPlatformAt ? formatYear(member.joinedPlatformAt) : "Không rõ"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <Button size="sm" onClick={() => approve(member.id)} className="flex-1 sm:flex-none">
                    Phê duyệt
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => reject(member.id)} className="flex-1 sm:flex-none">
                    Từ chối
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="bg-muted p-4 rounded-full">
              <UserX className="size-12 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-lg">Không có yêu cầu nào</p>
              <p className="text-muted-foreground text-sm">Hiện tại không có thành viên nào đang chờ phê duyệt.</p>
            </div>
          </div>
        )}
        
        {hasNext && members.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={loadMore} disabled={loading}>
              {loading ? "Đang tải..." : "Tải thêm"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
