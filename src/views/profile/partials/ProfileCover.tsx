import type { UserProfileDTO } from '@/types/interfaces/user/UserProfileDTO'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, Pencil, ChevronDown, Camera, Upload } from 'lucide-react'
import { useState, useRef } from 'react'
import { resolveUploadUrl } from '@/utils/uploadHelper'
import { useUploadCover } from '@/hooks/useProfile'
import ProfileEditPanel from './ProfileEditPanel'

interface ProfileCoverProps {
  profile: UserProfileDTO
  isOwner: boolean
}

export default function ProfileCover({ profile, isOwner }: ProfileCoverProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [editPanelOpen, setEditPanelOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { upload: uploadCover, loading: coverLoading } = useUploadCover()

  const coverSrc = coverPreview ?? resolveUploadUrl(profile.coverPhoto)
  const avatarSrc = resolveUploadUrl(profile.avatar) ?? undefined

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Preview optimistic
    const reader = new FileReader()
    reader.onload = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)
    // Upload thực
    const url = await uploadCover(file)
    if (url) setCoverPreview(url)
    // Reset input để có thể chọn lại cùng file
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-background flex flex-col w-full relative">
      <div className="w-full aspect-[3/1] max-h-[400px] overflow-hidden rounded-b-lg relative bg-muted group">
        {coverSrc && (
          <img src={coverSrc} alt="Cover" className="w-full h-full object-cover" />
        )}

        {isOwner && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="secondary"
                    className="bg-white/80 hover:bg-white text-black backdrop-blur-sm"
                    disabled={coverLoading}
                  />
                }
              >
                <Camera data-icon="inline-start" />
                {coverLoading ? 'Đang tải...' : 'Chỉnh sửa ảnh bìa'}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 size-4" />
                  Tải ảnh lên
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
            <AvatarImage src={avatarSrc} alt={profile.userName} className="object-cover bg-background" />
            <AvatarFallback className="text-4xl">{profile.userName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4 md:mb-2">
            <h1 className="text-3xl font-bold">{profile.nickName ?? profile.userName}</h1>
            <p className="text-muted-foreground font-medium hover:underline cursor-pointer">
              {profile.friendCount} người bạn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 md:mb-2 w-full md:w-auto justify-center md:justify-end">
          {isOwner ? (
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
            <DropdownMenuTrigger render={<Button variant="secondary" size="icon" className="px-2" />}>
              <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Cài đặt trang cá nhân</DropdownMenuItem>
              <DropdownMenuItem>Kho lưu trữ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
