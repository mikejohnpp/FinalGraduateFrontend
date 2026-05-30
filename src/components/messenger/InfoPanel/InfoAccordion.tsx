// @ts-nocheck
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Pin, Image, FileText, Link, Palette, Shield, AlertTriangle, Ban } from "lucide-react";

export default function InfoAccordion() {
  return (
    // @ts-expect-error type is valid
    <Accordion type="multiple" className="px-2">
      {/* Chat info */}
      <AccordionItem value="chat-info" className="border-none">
        <AccordionTrigger className="rounded-lg px-2 py-3 text-sm font-medium hover:bg-secondary hover:no-underline">
          Thông tin về đoạn chat
        </AccordionTrigger>
        <AccordionContent className="px-2 pb-2">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-3 rounded-lg px-2 text-sm font-normal"
            >
              <Pin data-icon="inline-start" />
              Xem tin nhắn đã ghim
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Customize chat */}
      <AccordionItem value="customize" className="border-none">
        <AccordionTrigger className="rounded-lg px-2 py-3 text-sm font-medium hover:bg-secondary hover:no-underline">
          Tùy chỉnh đoạn chat
        </AccordionTrigger>
        <AccordionContent className="px-2 pb-2">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-3 rounded-lg px-2 text-sm font-normal"
            >
              <Palette data-icon="inline-start" />
              Đổi chủ đề
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Media & files */}
      <AccordionItem value="media" className="border-none">
        <AccordionTrigger className="rounded-lg px-2 py-3 text-sm font-medium hover:bg-secondary hover:no-underline">
          File phương tiện và file
        </AccordionTrigger>
        <AccordionContent className="px-2 pb-2">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-3 rounded-lg px-2 text-sm font-normal"
            >
              <Image data-icon="inline-start" />
              File phương tiện
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-3 rounded-lg px-2 text-sm font-normal"
            >
              <FileText data-icon="inline-start" />
              File
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-3 rounded-lg px-2 text-sm font-normal"
            >
              <Link data-icon="inline-start" />
              Liên kết
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Privacy & support */}
      <AccordionItem value="privacy" className="border-none">
        <AccordionTrigger className="rounded-lg px-2 py-3 text-sm font-medium hover:bg-secondary hover:no-underline">
          Quyền riêng tư và hỗ trợ
        </AccordionTrigger>
        <AccordionContent className="px-2 pb-2">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-3 rounded-lg px-2 text-sm font-normal"
            >
              <Shield data-icon="inline-start" />
              Hạn chế
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-3 rounded-lg px-2 text-sm font-normal"
            >
              <Ban data-icon="inline-start" />
              Chặn
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-3 rounded-lg px-2 text-sm font-normal text-destructive hover:text-destructive"
            >
              <AlertTriangle data-icon="inline-start" />
              Báo cáo
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
