import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { reelActions } from "@/stores/reelSlice";
import storyService from "@/services/StoryService";

export function useReels(userId?: number) {
  const dispatch = useDispatch();
  const { reels, hasMore } = useSelector((state: RootState) => state.reel);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const fetchReels = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = userId 
        ? await storyService.getAllReelByUserId(userId, pageNum)
        : await storyService.getAllReel(pageNum);
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
    dispatch(reelActions.clearReels());
    setPage(0);
    fetchReels(0);
  }, [userId]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReels(nextPage);
    }
  };

  return { reels, loading, hasMore, loadMore };
}
