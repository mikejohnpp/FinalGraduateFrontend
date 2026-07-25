import { useEffect, useState, useRef } from "react";
import { useReels } from "@/hooks/useReel";
import { ChevronUp, ChevronDown, Volume2, VolumeX, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Reels() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get("userId");
  const userId = userIdParam ? Number(userIdParam) : undefined;

  const { reels, hasMore, loadMore, loading } = useReels(userId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reels.length > 0 && activeIndex >= reels.length - 2 && hasMore && !loading) {
      loadMore();
    }
  }, [activeIndex, reels.length, hasMore, loading, loadMore]);

  const handleNext = () => {
    if (activeIndex < reels.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const activeReel = reels[activeIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  }, [activeIndex]);

  if (!activeReel && !loading) {
    return (
      <div className="flex h-[calc(100vh-62px)] items-center justify-center bg-black text-white">
        Không có thước phim nào
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black md:relative md:z-auto md:h-[calc(100vh-62px)] md:w-full md:bg-[#18191A]">
      <div className="absolute top-1/2 right-4 z-30 flex -translate-y-1/2 flex-col gap-4">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10"
        >
          <ChevronUp className="size-8" />
        </button>
        <button
          onClick={handleNext}
          disabled={activeIndex === reels.length - 1 && !hasMore}
          className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10"
        >
          <ChevronDown className="size-8" />
        </button>
      </div>

      {activeReel ? (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black md:max-h-[90%] md:max-w-125 md:rounded-xl md:shadow-2xl">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <X className="size-6" />
          </button>

          {/* <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 left-4 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button> */}

          <video
            ref={videoRef}
            src={activeReel.urlVideo || ""}
            className="h-full w-full object-contain"
            autoPlay
            playsInline
            loop
            controls
          />

          <div className="absolute top-0 left-0 w-full bg-linear-to-t from-black/80 via-black/40 to-transparent p-4">
            <div className="flex items-center gap-3">
              <Avatar
                className="size-10 border-2 border-primary hover:cursor-pointer"
                onClick={() => navigate(`/profile/${activeReel.user.id}`)}
              >
                <AvatarImage src={activeReel.user?.avatarUrl || ""} />
                <AvatarFallback>
                  {activeReel.user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-white">
                  {activeReel.user?.username || "Người dùng"}
                </span>
                <span className="line-clamp-2 text-xs text-white/80">{activeReel.content}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white">Đang tải...</div>
      )}
    </div>
  );
}
