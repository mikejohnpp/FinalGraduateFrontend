import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { ArrowLeft } from "lucide-react";
import { BG_COLORS, type StoryType } from "./types";
import StoryTypePicker from "./partials/StoryTypePicker";
import TextStorySidebar from "./partials/TextStorySidebar";
import ImageStorySidebar from "./partials/ImageStorySidebar";
import VideoStorySidebar from "./partials/VideoStorySidebar";
import StoryPreview from "./partials/StoryPreview";
import { useCreateStory } from "@/hooks/useStory";
import { useIsMobile } from "@/hooks/use-mobile";

const SIDEBAR_TITLES: Record<NonNullable<StoryType>, string> = {
  text: "Tạo tin văn bản",
  image: "Tạo tin ảnh",
  video: "Tạo tin video",
};

export default function CreateStory() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const { create, loading } = useCreateStory();

  const [storyType, setStoryType] = useState<StoryType>(null);
  const [textContent, setTextContent] = useState("");
  const [selectedBg, setSelectedBg] = useState(BG_COLORS[0].value);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [overlayText, setOverlayText] = useState("");
  const [hasMusicText, setHasMusicText] = useState(false);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const isMobile = useIsMobile();

  const resetForm = () => {
    setStoryType(null);
    setImageFile(null);
    setImagePreview(null);
    setVideoFile(null);
    setVideoPreview(null);
    setTextContent("");
    setOverlayText("");
    setMusicFile(null);
    setHasMusicText(false);
  };

  const handleBack = () => (storyType !== null ? resetForm() : navigate(-1));

  const handleSubmit = () => {
    create({ storyType, textContent, selectedBg, imageFile, videoFile, musicFile, overlayText });
  };

  return (
    <div className="mt-12 flex h-screen flex-col bg-background text-foreground md:mt-0 md:flex-row md:overflow-hidden">
      <aside className="z-10 flex h-auto min-h-fit w-full shrink-0 flex-col border-b border-border bg-card shadow-xl md:h-full md:w-[360px] md:overflow-y-auto md:border-r md:border-b-0 md:shadow-2xl">
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 pt-5 pb-4">
          <button
            onClick={handleBack}
            className="flex size-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">
              {storyType === null ? "Tin của bạn" : SIDEBAR_TITLES[storyType]}
            </h1>
            {storyType === null && (
              <p className="mt-0.5 text-xs text-muted-foreground">Chia sẻ một khoảnh khắc</p>
            )}
          </div>
        </div>

        {storyType === null && <StoryTypePicker user={user} onSelect={setStoryType} />}

        {storyType === "text" && (
          <TextStorySidebar
            textContent={textContent}
            setTextContent={setTextContent}
            selectedBg={selectedBg}
            setSelectedBg={setSelectedBg}
            hasMusicText={hasMusicText}
            setHasMusicText={setHasMusicText}
            musicFile={musicFile}
            setMusicFile={setMusicFile}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
        {storyType === "image" && (
          <ImageStorySidebar
            imageFile={imageFile}
            imagePreview={imagePreview}
            setImageFile={setImageFile}
            setImagePreview={setImagePreview}
            overlayText={overlayText}
            setOverlayText={setOverlayText}
            hasMusicText={hasMusicText}
            setHasMusicText={setHasMusicText}
            musicFile={musicFile}
            setMusicFile={setMusicFile}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
        {storyType === "video" && (
          <VideoStorySidebar
            videoFile={videoFile}
            videoPreview={videoPreview}
            setVideoFile={setVideoFile}
            setVideoPreview={setVideoPreview}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </aside>

      <div className="flex min-h-[60vh] flex-1 items-center justify-center bg-[#f0f2f5] p-4 md:min-h-0 md:bg-transparent md:p-0">
        <StoryPreview
          storyType={storyType}
          user={user}
          onSelect={setStoryType}
          textContent={textContent}
          selectedBg={selectedBg}
          imagePreview={imagePreview}
          overlayText={overlayText}
          videoPreview={videoPreview}
          hasMusicText={hasMusicText}
          musicTitle={musicFile?.name ?? ""}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
