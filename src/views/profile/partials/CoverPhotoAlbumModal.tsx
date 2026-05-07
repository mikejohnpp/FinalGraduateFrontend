import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { mockPhotos } from '@/data/mock/photosMock'
import { cn } from '@/lib/utils'

interface CoverPhotoAlbumModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectPhoto: (photoUrl: string) => void
}

export default function CoverPhotoAlbumModal({ open, onOpenChange, onSelectPhoto }: CoverPhotoAlbumModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const handleConfirm = () => {
    if (selectedPhoto) {
      onSelectPhoto(selectedPhoto)
      onOpenChange(false)
      // Reset after closing
      setTimeout(() => setSelectedPhoto(null), 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chọn ảnh bìa</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto p-1 no-scrollbar">
          {mockPhotos.map((photo, index) => (
            <div 
              key={index} 
              className={cn(
                "aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all",
                selectedPhoto === photo ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:opacity-80"
              )}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo} alt={`Album photo ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="secondary" onClick={() => setSelectedPhoto(null)}>Hủy</Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={!selectedPhoto}>
            Đặt làm ảnh bìa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
