import { useState, useRef, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/stores/store";
import { reelActions } from "@/stores/reelSlice";
import { uploadToStorage } from "@/plugins/storage";
import storyService from "@/services/StoryService";
import { toast } from "sonner";

interface CreateReelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateReelModal({ open, onOpenChange }: CreateReelModalProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useDispatch();

  const MAX_SIZE_MB = 200;
  const MAX_DURATION_SEC = 180;

  const validateAndSetVideo = (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Vui lòng chọn file video hợp lệ.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Kích thước video quá lớn. Tối đa là ${MAX_SIZE_MB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoElement.src);
      if (videoElement.duration > MAX_DURATION_SEC) {
        toast.error(`Video quá dài. Thời lượng tối đa là 3 phút.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setVideoFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    };

    videoElement.src = URL.createObjectURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetVideo(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetVideo(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (loading) return;
    onOpenChange(newOpen);
    if (!newOpen) {
      handleRemoveVideo();
    }
  };

  const handleCreateReel = async () => {
    if (!userId) {
      toast.error("Bạn chưa đăng nhập");
      return;
    }
    if (!videoFile) {
      toast.error("Vui lòng chọn video");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Đang đăng thước phim...");

    try {
      const result = await uploadToStorage(videoFile);
      const urlVideo = result.url;

      const reel = await storyService.createStory({
        userId: Number(userId),
        content: "",
        urlImage: undefined,
        urlVideo,
        type: "REEL",
        color: undefined,
      });

      if (!reel) throw new Error("Không nhận được phản hồi từ server");

      dispatch(reelActions.prependReel(reel));

      toast.success("Đăng thước phim thành công!", { id: toastId });
      onOpenChange(false);
      handleRemoveVideo();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đăng thước phim thất bại";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-6xl sm:max-w-6xl gap-0 overflow-hidden rounded-xl border-none bg-[#242526] p-0 text-[#E4E6EB]"
      >
        <DialogHeader className="relative flex items-center justify-center border-b border-[#3E4042] p-4">
          <DialogTitle className="text-center text-xl font-bold">Tạo thước phim</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full text-[#B0B3B8] hover:bg-[#3A3B3C] hover:text-[#E4E6EB]"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-auto md:h-[550px] max-h-[85vh] overflow-y-auto md:overflow-hidden">
          <div className="flex w-full md:w-[350px] shrink-0 flex-col border-b md:border-b-0 md:border-r border-[#3E4042] bg-[#242526] p-4">
            {!previewUrl ? (
              <div
                className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#3E4042] transition-colors hover:bg-[#3A3B3C]"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#3A3B3C]">
                  <Video className="h-5 w-5" />
                </div>
                <span className="text-[15px] font-semibold">Thêm video</span>
                <span className="text-xs text-[#B0B3B8]">hoặc kéo và thả</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex flex-1 flex-col">
                <div className="flex-1">
                  <p className="mb-2 text-sm font-semibold">Video đã chọn:</p>
                  <div className="flex items-center justify-between rounded-lg bg-[#3A3B3C] p-3">
                    <span className="mr-2 truncate text-sm">{videoFile?.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveVideo}
                      className="h-6 w-6 rounded-full hover:bg-[#4E4F50]"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full bg-[#0866FF] font-semibold text-white hover:bg-[#1877F2]"
                  onClick={handleCreateReel}
                  disabled={loading}
                >
                  {loading ? "Đang đăng..." : "Đăng"}
                </Button>
              </div>
            )}

            {!previewUrl && (
              <div className="mt-4">
                <Button className="w-full cursor-not-allowed bg-[#0866FF] font-semibold text-white opacity-50 hover:bg-[#1877F2]">
                  Tiếp
                </Button>
              </div>
            )}
          </div>

          <div className="flex w-full flex-1 flex-col bg-[#18191A] p-4 md:p-6 min-h-[350px] md:min-h-0">
            <span className="mb-4 text-[13px] font-semibold text-[#B0B3B8]">Xem trước</span>
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-[#3E4042] bg-[#242526]">
              {previewUrl ? (
                <video src={previewUrl} controls className="h-full w-full object-contain" />
              ) : (
                <div className="text-center">
                  <h3 className="mb-1 text-[15px] font-semibold">Bản xem trước video của bạn</h3>
                  <p className="text-[13px] text-[#B0B3B8]">
                    Hãy tải video lên để xem trước ở đây.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
