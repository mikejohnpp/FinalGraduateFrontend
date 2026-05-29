// @ts-nocheck
import type { UserProfile } from '@/types/Profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, Pencil, ChevronDown, Camera, Image as ImageIcon, Upload } from 'lucide-react'
import { useState, useRef } from 'react'
import CoverPhotoAlbumModal from './CoverPhotoAlbumModal'
import ProfileEditPanel from './ProfileEditPanel'

interface ProfileCoverProps {
  profile: UserProfile
  onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void
}

export default function ProfileCover({ profile, onProfileUpdate }: ProfileCoverProps) {
  const [coverPhoto, setCoverPhoto] = useState(profile.coverPhoto)
  const [albumModalOpen, setAlbumModalOpen] = useState(false)
  const [editPanelOpen, setEditPanelOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCoverPhoto(reader.result as string)
      onProfileUpdate({ ...profile, coverPhoto: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleSelectAlbumPhoto = (photoUrl: string) => {
    setCoverPhoto(photoUrl)
    onProfileUpdate({ ...profile, coverPhoto: photoUrl })
  }

  return (
    <div className="bg-background flex flex-col w-full relative">
      <div className="w-full aspect-[3/1] max-h-[400px] overflow-hidden rounded-b-lg relative bg-muted group">
        {coverPhoto && (
          <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        )}
        
        {profile.isOwner && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
                            {/* @ts-expect-error asChild is valid */}
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="bg-white/80 hover:bg-white text-black backdrop-blur-sm">
                  <Camera data-icon="inline-start" />
                  Chỉnh sửa ảnh bìa
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 size-4" />
                  Tải ảnh lên
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAlbumModalOpen(true)}>
                  <ImageIcon className="mr-2 size-4" />
                  Chọn ảnh từ album
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload} 
            />
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 relative pb-4 flex flex-col md:flex-row items-center md:items-end justify-between">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16 md:-mt-8 z-10">
          <Avatar className="size-40 border-4 border-background ring-1 ring-border/10">
            <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover bg-background" />
            <AvatarFallback className="text-4xl">{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4 md:mb-2">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground font-medium hover:underline cursor-pointer">
              {profile.friendCount} người bạn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 md:mb-2 w-full md:w-auto justify-center md:justify-end">
          {profile.isOwner ? (
            <>
              <Button>
                <Plus data-icon="inline-start" />
                Thêm vào tin
              </Button>
              <div className="relative">
                <Button variant="secondary" onClick={() => setEditPanelOpen(!editPanelOpen)}>
                  <Pencil data-icon="inline-start" />
                  Chỉnh sửa trang cá nhân
                </Button>
                {editPanelOpen && (
                  <ProfileEditPanel 
                    profile={profile} 
                    onClose={() => setEditPanelOpen(false)} 
                    onSave={(updated) => onProfileUpdate(updated)} 
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <Button>
                <Plus data-icon="inline-start" />
                Thêm bạn bè
              </Button>
              <Button variant="secondary">Nhắn tin</Button>
            </>
          )}

          <DropdownMenu>
            {/* @ts-expect-error */}
              <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="px-2">
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Cài đặt trang cá nhân</DropdownMenuItem>
              <DropdownMenuItem>Kho lưu trữ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {profile.isOwner && (
        <CoverPhotoAlbumModal 
          open={albumModalOpen} 
          onOpenChange={setAlbumModalOpen} 
          onSelectPhoto={handleSelectAlbumPhoto} 
        />
      )}
    </div>
  )
}
