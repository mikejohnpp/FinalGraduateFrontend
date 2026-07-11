import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import { ArrowLeft, Download, FileText, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { downloadMedia } from "@/utils/downloadMedia";

interface MediaManageConversationProps {
  setIsOpenManagerFileOrImage: (isOpen: boolean) => void;
}

function MediaManageConversation({ setIsOpenManagerFileOrImage }: MediaManageConversationProps) {
  const mediaManager = useSelector((state: any) => state.media);
  const files = mediaManager.messages.filter((message: any) => message.messageType === "FILE");
  const images = mediaManager.messages.filter((message: any) => message.messageType === "IMAGE");
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  console.log("MediaManageConversation files", files);
  console.log("MediaManageConversation images", images);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-10 rounded-full"
          onClick={() => setIsOpenManagerFileOrImage(false)}
        >
          <ArrowLeft className="size-7" />
        </Button>
        <h2 className="text-sm font-semibold text-foreground">Quản lý phương tiện</h2>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <Tabs defaultValue="image" className="flex min-h-0 flex-1 flex-col">
          <div className="mb-2 shrink-0">
            <TabsList className="w-full">
              <TabsTrigger value="image" className="flex-1">
                Image
              </TabsTrigger>
              <TabsTrigger value="file" className="flex-1">
                File
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="image"
            className="flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
          >
            <ScrollArea className="h-full min-h-0 flex-1 px-1">
              <div className="grid grid-cols-2 gap-2">
                {images.map((image: any) => (
                  <button
                    key={image.id}
                    type="button"
                    className="overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.content}
                      alt={image.content || "Image"}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                    <div className="p-2">
                      <p className="text-xs text-muted-foreground">
                        {dinhDangThoiGian(image.createdAt)}
                      </p>
                    </div>
                  </button>
                ))}
                {images.length === 0 && (
                  <div className="col-span-2 flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <p className="text-sm">Không có hình ảnh nào </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="file"
            className="m-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
          >
            <ScrollArea className="h-full min-h-0 flex-1 px-1">
              <div className="flex flex-col gap-2">
                {files.map((file: any) => {
                  const parts = file.content.split("|");
                  const fileUrl = parts[0];
                  const fileName =
                    parts.length > 1 ? parts.slice(1).join("|") : fileUrl.split("/").pop();
                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-3"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="rounded-md bg-muted p-2">
                          <FileText className="size-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {dinhDangThoiGian(file.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                        aria-label="Tải xuống file"
                        onClick={() => downloadMedia(fileUrl, fileName)}
                      >
                        <Download className="size-4" />
                      </Button>
                    </div>
                  );
                })}

                {files.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <p className="text-sm">Không có tệp nào </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Xem ảnh</p>
                <p className="text-xs text-muted-foreground">
                  {selectedImage.content || "Ảnh đính kèm"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="inline-flex items-center gap-1"
                  onClick={() => downloadMedia(selectedImage.content, "image")}
                >
                  <Download className="size-4" />
                  Tải xuống
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <img
                src={selectedImage.content}
                alt={selectedImage.content || "Preview"}
                className="mx-auto max-h-[70vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaManageConversation;
