import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import CreateReelModal from "./CreateReelModal";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/stores/store";
import storyService from "@/services/StoryService";
import { reelActions } from "@/stores/reelSlice";

export default function ProfileReel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reels = useSelector((state: RootState) => state.reel.reels);
  const hasMore = useSelector((state: RootState) => state.reel.hasMore);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [openCreate, setOpenCreate] = useState(false);

  const { userId: paramUserId } = useParams();
  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const targetUserId = paramUserId || currentUserId;

  const fetchReels = async (pageNum: number) => {
    if (!targetUserId) return;
    setLoading(true);
    try {
      const data = await storyService.getAllReelByUserId(Number(targetUserId), pageNum);
      if (data && data.length > 0) {
        if (pageNum === 0) {
          dispatch(reelActions.setReels(data));
        } else {
          dispatch(reelActions.appendReels(data));
        }
      } else {
        dispatch(reelActions.setHasMore(false));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    dispatch(reelActions.clearReels());
    fetchReels(0);
  }, [targetUserId]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReels(nextPage);
  };

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between pt-6 pb-2">
        <CardTitle className="text-xl font-bold">Reels</CardTitle>
        <Button
          onClick={() => setOpenCreate(true)}
          variant="link"
          className="h-auto cursor-pointer rounded-md px-3 py-1.5 font-bold text-primary transition-colors hover:bg-primary/10 hover:no-underline"
        >
          Tạo thước phim
        </Button>
        <CreateReelModal open={openCreate} onOpenChange={setOpenCreate} />
      </CardHeader>
      <CardContent className="pt-2">
        <Tabs defaultValue="yours" className="w-full">
          <TabsList variant="line" className="mb-4">
            <TabsTrigger
              value="yours"
              className="px-4 pb-2 data-active:text-primary data-active:after:bg-primary"
            >
              Thước phim của bạn
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yours" className="flex min-h-[200px] flex-col justify-center">
            {reels.length === 0 ? (
              <div className="py-12 text-center text-base font-semibold text-muted-foreground">
                Bạn chưa tạo thước phim nào.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                  {reels.map((reel, index) => (
                    <div
                      key={reel.id || index}
                      className="relative aspect-[9/16] cursor-pointer overflow-hidden rounded-xl border border-[#3E4042] bg-[#242526] transition-opacity hover:opacity-90"
                      onClick={() => navigate(`/reels?userId=${targetUserId}`)}
                    >
                      <video
                        src={reel.urlVideo || ""}
                        className="h-full w-full object-cover"
                        preload="metadata"
                      />
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                      {loading ? "Đang tải..." : "Xem thêm"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
