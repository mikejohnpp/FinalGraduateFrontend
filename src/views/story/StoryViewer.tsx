import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useFriendsStories } from "@/hooks/useStory";
import AnhAvatar from "@/assets/images/AnhAvatar.jpg";
import { cn } from "@/lib/utils";

const STORY_DURATION = 5000;

export default function StoryViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { groupedStories, loading } = useFriendsStories();

  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const targetUserId = searchParams.get("user");

  useEffect(() => {
    setVideoProgress(0);
  }, [activeStoryIndex, activeGroupIndex]);

  useEffect(() => {
    if (!groupedStories.length) return;
    if (targetUserId) {
      const idx = groupedStories.findIndex((g) => g.user.id === Number(targetUserId));
      if (idx !== -1) {
        setActiveGroupIndex(idx);
        setActiveStoryIndex(0);
      }
    }
  }, [groupedStories, targetUserId]);

  const activeGroup = groupedStories[activeGroupIndex];
  const activeStory = activeGroup?.stories[activeStoryIndex];

  const handleNext = () => {
    if (!activeGroup) return;
    if (activeStoryIndex < activeGroup.stories.length - 1) {
      setActiveStoryIndex((prev) => prev + 1);
    } else if (activeGroupIndex < groupedStories.length - 1) {
      setActiveGroupIndex((prev) => prev + 1);
      setActiveStoryIndex(0);
    } else {
      navigate("/");
    }
  };

  const handlePrev = () => {
    if (!activeGroup) return;
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1);
    } else if (activeGroupIndex > 0) {
      const prevGroup = groupedStories[activeGroupIndex - 1];
      setActiveGroupIndex(activeGroupIndex - 1);
      setActiveStoryIndex(prevGroup.stories.length - 1);
    }
  };

  if (loading && !groupedStories.length) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        Đang tải...
      </div>
    );
  }
  if (!activeGroup || !activeStory) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        Không có story nào.
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-black">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-50 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="size-6" />
      </button>

      <div className="hidden h-full w-[360px] flex-col border-r border-white/10 bg-[#18191A] pt-16 md:flex">
        <h2 className="mb-4 px-4 text-2xl font-bold text-white">Tin</h2>
        <h3 className="mb-2 px-4 text-sm font-semibold text-white">Tất cả tin</h3>
        <div className="flex-1 space-y-1 overflow-y-auto px-2">
          {groupedStories.map((group, idx) => (
            <button
              key={group.user.id}
              onClick={() => {
                setActiveGroupIndex(idx);
                setActiveStoryIndex(0);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-2 transition-colors",
                idx === activeGroupIndex ? "bg-white/10" : "hover:bg-white/5",
              )}
            >
              <div className="rounded-full p-0.5 ring-2 ring-primary">
                <img
                  src={group.user.avatarUrl || AnhAvatar}
                  alt={group.user.username}
                  className="size-12 rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-white">{group.user.username}</span>
                <span className="text-xs text-blue-400">
                  {idx === activeGroupIndex ? "Đang xem" : `${group.stories.length} thẻ mới`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-[#111]">
        <style>{`
          @keyframes fillBar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
        <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-zinc-900 md:h-[85vh] md:max-h-[720px] md:max-w-[380px] md:rounded-2xl md:shadow-2xl">
          <div className="absolute top-2 right-0 left-0 z-20 flex gap-1 px-2">
            {activeGroup.stories.map((s, i) => {
              const hasVideo = !!s.urlVideo && s.urlVideo !== "null" && s.urlVideo !== "undefined";
              return (
                <ProgressBar
                  key={s.id}
                  isActive={i === activeStoryIndex}
                  isPast={i < activeStoryIndex}
                  isPaused={isPaused}
                  duration={STORY_DURATION}
                  onComplete={handleNext}
                  isVideo={hasVideo}
                  videoProgress={videoProgress}
                />
              );
            })}
          </div>

          <div className="absolute top-6 right-4 left-4 z-20 flex items-center gap-3">
            <img
              src={activeGroup.user.avatarUrl || AnhAvatar}
              className="size-10 rounded-full object-cover ring-2 ring-white/50 hover:cursor-pointer"
              onClick={() => navigate(`/profile/${activeGroup.user.id}`)}
            />
            <div className="flex flex-col shadow-sm">
              <span className="text-sm font-semibold text-white drop-shadow-md">
                {activeGroup.user.username}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-white drop-shadow-md hover:text-white/80"
              >
                {isPaused ? <Play className="size-5" /> : <Pause className="size-5" />}
              </button>
              {activeStory.urlVideo && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white drop-shadow-md hover:text-white/80"
                >
                  {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                </button>
              )}
            </div>
          </div>

          <div
            className="relative h-full w-full"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {activeStory.urlImage &&
              activeStory.urlImage !== "null" &&
              activeStory.urlImage !== "undefined" && (
                <img
                  src={activeStory.urlImage}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

            {activeStory.color && (
              <div
                className="absolute inset-0 flex h-full w-full items-center justify-center p-6 text-center"
                style={{ background: activeStory.color }}
              >
                {activeStory.content && (
                  <p className="text-2xl font-bold break-all whitespace-pre-wrap text-white">
                    {activeStory.content}
                  </p>
                )}
              </div>
            )}

            {activeStory.urlVideo &&
              activeStory.urlVideo !== "null" &&
              activeStory.urlVideo !== "undefined" && (
                <video
                  src={activeStory.urlVideo}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover",
                    !activeStory.urlImage && !activeStory.color ? "block" : "hidden",
                  )}
                  autoPlay
                  muted={isMuted}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    if (video.duration) {
                      setVideoProgress((video.currentTime / video.duration) * 100);
                    }
                  }}
                  onEnded={() => {
                    handleNext();
                  }}
                />
              )}

            {activeStory.urlImage &&
              activeStory.urlImage !== "null" &&
              activeStory.urlImage !== "undefined" &&
              activeStory.content && (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <p className="text-center text-2xl font-bold break-all whitespace-pre-wrap text-white drop-shadow-xl">
                    {activeStory.content}
                  </p>
                </div>
              )}
          </div>
        </div>

        {(activeGroupIndex > 0 || activeStoryIndex > 0) && (
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
          >
            <ChevronLeft className="size-8" />
          </button>
        )}

        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
        >
          <ChevronRight className="size-8" />
        </button>
      </div>
    </div>
  );
}

function ProgressBar({
  isActive,
  isPast,
  isPaused,
  duration,
  onComplete,
  isVideo,
  videoProgress,
}: {
  isActive: boolean;
  isPast: boolean;
  isPaused: boolean;
  duration: number;
  onComplete: () => void;
  isVideo: boolean;
  videoProgress: number;
}) {
  return (
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
      <div
        key={isActive ? "active" : isPast ? "past" : "idle"}
        className="h-full bg-white"
        style={{
          width: isPast ? "100%" : isActive && isVideo ? `${videoProgress}%` : "0%",
          animation: isActive && !isVideo ? `fillBar ${duration}ms linear forwards` : "none",
          animationPlayState: isPaused ? "paused" : "running",
          transition: isVideo && isActive ? "width 250ms linear" : "none",
        }}
        onAnimationEnd={() => {
          if (isActive && !isVideo) onComplete();
        }}
      />
    </div>
  );
}
