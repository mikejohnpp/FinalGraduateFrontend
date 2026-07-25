import { FileIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/interfaces/media/IMedia";

interface MediaGalleryProps {
  media: MediaItem[] | undefined | null;
  className?: string;
  size?: "post" | "comment";
  onOpenLightbox?: (index: number) => void;
}

function fileNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const name = pathname.substring(pathname.lastIndexOf("/") + 1);
    return decodeURIComponent(name) || "Tệp đính kèm";
  } catch {
    return "Tệp đính kèm";
  }
}

function SingleMediaFrame({
  url,
  type,
  heightCap,
  rounded,
  onClick,
  children,
}: {
  url: string;
  type: "IMAGE" | "VIDEO";
  heightCap: string;
  rounded?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden bg-muted",
        rounded && "rounded-lg",
        heightCap,
      )}
    >
      {/* Lớp nền mờ để lấp đầy hai bên viền (letterbox) */}
      {type === "IMAGE" ? (
        <img
          src={url}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full scale-110 object-cover blur-2xl"
        />
      ) : (
        <video
          src={url}
          aria-hidden
          muted
          playsInline
          className="pointer-events-none absolute inset-0 size-full scale-110 object-cover blur-2xl"
        />
      )}
      {/* Lớp phủ tối nhẹ để media chính nổi bật hơn trên nền mờ */}
      <div aria-hidden className="absolute inset-0 bg-black/20" />

      {/* Media chính: hiển thị toàn bộ, không crop */}
      {type === "IMAGE" ? (
        onClick ? (
          <button
            type="button"
            onClick={onClick}
            className="relative z-10 flex size-full cursor-pointer items-center justify-center"
          >
            <img src={url} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
          </button>
        ) : (
          <img
            src={url}
            alt=""
            loading="lazy"
            className="relative z-10 max-h-full max-w-full object-contain"
          />
        )
      ) : (
        <>
          <video
            src={url}
            controls
            className="relative z-10 max-h-full max-w-full object-contain"
          />
          {children}
        </>
      )}
    </div>
  );
}


function ImageTile({
  item,
  rounded,
  onClick,
  overlayCount,
  className,
}: {
  item: MediaItem;
  rounded?: boolean;
  onClick?: () => void;
  overlayCount?: number;
  className?: string;
}) {
  const imgClass = "size-full object-cover";
  const overlay =
    overlayCount && overlayCount > 0 ? (
      <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-2xl font-semibold text-white">
        +{overlayCount}
      </span>
    ) : null;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative block size-full cursor-pointer overflow-hidden bg-muted",
          rounded && "rounded-lg",
          className,
        )}
      >
        <img src={item.url} alt="" loading="lazy" className={imgClass} />
        {overlay}
      </button>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative block size-full overflow-hidden bg-muted",
        rounded && "rounded-lg",
        className,
      )}
    >
      <img src={item.url} alt="" loading="lazy" className={imgClass} />
      {overlay}
    </a>
  );
}

/**
 * Bố cục ảnh kiểu Facebook (mosaic) tuỳ số lượng ảnh:
 * - 1 ảnh: full width.
 * - 2 ảnh: 2 cột bằng nhau.
 * - 3 ảnh: 1 ảnh lớn bên trái + 2 ảnh xếp dọc bên phải.
 * - 4 ảnh: lưới 2x2.
 * - >= 5 ảnh: 2 ảnh hàng trên + 3 ảnh hàng dưới, ô cuối phủ "+N" nếu còn ảnh ẩn.
 */
function ImageMosaic({
  images,
  isComment,
  clickOf,
}: {
  images: MediaItem[];
  isComment: boolean;
  clickOf: (item: MediaItem) => (() => void) | undefined;
}) {
  const count = images.length;
  const heightCap = isComment ? "max-h-[400px]" : "max-h-[80vh]";

  // Comment: giữ bo góc + khoảng cách rõ. Post: sát nhau, không bo góc.
  const gap = isComment ? "gap-1.5" : "gap-0.5";
  const tileRounded = isComment;

  // 1 ảnh: hiển thị toàn bộ + làm mờ hai bên viền (letterbox).
  if (count === 1) {
    return (
      <SingleMediaFrame
        url={images[0].url}
        type="IMAGE"
        heightCap={heightCap}
        rounded={isComment}
        onClick={clickOf(images[0])}
      />
    );
  }


  // 2 ảnh: 2 cột bằng nhau, mỗi ô vuông.
  if (count === 2) {
    return (
      <div className={cn("grid grid-cols-2", gap)}>
        {images.map((item) => (
          <div
            key={item.id}
            className={cn("aspect-square overflow-hidden", tileRounded && "rounded-lg")}
          >
            <ImageTile item={item} rounded={tileRounded} onClick={clickOf(item)} />
          </div>
        ))}
      </div>
    );
  }

  // 3 ảnh: 1 lớn trái + 2 dọc phải.
  if (count === 3) {
    return (
      <div className={cn("grid grid-cols-2", gap)}>
        <div className={cn("h-full", tileRounded && "rounded-lg")}>
          <ImageTile item={images[0]} rounded={tileRounded} onClick={clickOf(images[0])} />
        </div>
        <div className={cn("grid grid-rows-2", gap)}>
          {images.slice(1, 3).map((item) => (
            <div key={item.id} className={cn("h-full", tileRounded && "rounded-lg")}>
              <ImageTile item={item} rounded={tileRounded} onClick={clickOf(item)} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4 ảnh: lưới 2x2.
  if (count === 4) {
    return (
      <div className={cn("grid grid-cols-2", gap)}>
        {images.map((item) => (
          <div
            key={item.id}
            className={cn("aspect-square overflow-hidden", tileRounded && "rounded-lg")}
          >
            <ImageTile item={item} rounded={tileRounded} onClick={clickOf(item)} />
          </div>
        ))}
      </div>
    );
  }

  // >= 5 ảnh: 2 ô hàng trên + 3 ô hàng dưới, ô thứ 5 phủ "+N" nếu còn ảnh ẩn.
  const top = images.slice(0, 2);
  const bottom = images.slice(2, 5);
  const remaining = count - 5;

  return (
    <div className={cn("flex flex-col", gap)}>
      <div className={cn("grid grid-cols-2", gap)}>
        {top.map((item) => (
          <div
            key={item.id}
            className={cn("aspect-[4/3] overflow-hidden", tileRounded && "rounded-lg")}
          >
            <ImageTile item={item} rounded={tileRounded} onClick={clickOf(item)} />
          </div>
        ))}
      </div>
      <div className={cn("grid grid-cols-3", gap)}>
        {bottom.map((item, idx) => {
          const isLast = idx === bottom.length - 1;
          return (
            <div
              key={item.id}
              className={cn("aspect-square overflow-hidden", tileRounded && "rounded-lg")}
            >
              <ImageTile
                item={item}
                rounded={tileRounded}
                onClick={clickOf(item)}
                overlayCount={isLast && remaining > 0 ? remaining : undefined}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}


/**
 * Render danh sách media (đã sort theo position) theo từng loại.
 * - IMAGE: bố cục mosaic kiểu Facebook (xem ImageMosaic).
 * - VIDEO: thẻ <video controls>.
 * - AUDIO: thẻ <audio controls>.
 * - FILE: link tải xuống.
 */
export default function MediaGallery({
  media,
  className,
  size = "post",
  onOpenLightbox,
}: MediaGalleryProps) {
  if (!media || media.length === 0) return null;

  const images = media.filter((m) => m.mediaType === "IMAGE");
  const videos = media.filter((m) => m.mediaType === "VIDEO");
  const audios = media.filter((m) => m.mediaType === "AUDIO");
  const files = media.filter((m) => m.mediaType === "FILE");

  const isComment = size === "comment";

  // Index của item trong danh sách ảnh+video xem được (khớp với MediaLightbox).
  const viewable = media.filter((m) => m.mediaType === "IMAGE" || m.mediaType === "VIDEO");
  const viewIndexOf = (item: MediaItem) => viewable.findIndex((m) => m.id === item.id);
  const clickOf = (item: MediaItem) =>
    onOpenLightbox ? () => onOpenLightbox(viewIndexOf(item)) : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Ảnh — bố cục mosaic kiểu Facebook */}
      {images.length > 0 && <ImageMosaic images={images} isComment={isComment} clickOf={clickOf} />}

      {/* Video — hiển thị toàn bộ + làm mờ hai bên viền (letterbox) */}
      {videos.map((item) => (
        <SingleMediaFrame
          key={item.id}
          url={item.url}
          type="VIDEO"
          heightCap={isComment ? "max-h-[400px]" : "max-h-[80vh]"}

        >
          {onOpenLightbox && (
            <button
              type="button"
              onClick={() => onOpenLightbox(viewIndexOf(item))}
              className="absolute inset-x-0 top-0 bottom-12 z-20 cursor-pointer"
              aria-label="Xem video"
            />
          )}
        </SingleMediaFrame>
      ))}


      {/* Audio */}
      {audios.map((item) => (
        <audio key={item.id} src={item.url} controls className="w-full" />
      ))}

      {/* File đính kèm */}
      {files.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          <FileIcon className="size-5 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate">{fileNameFromUrl(item.url)}</span>
          <Download className="size-4 shrink-0 text-muted-foreground" />
        </a>
      ))}
    </div>
  );
}
