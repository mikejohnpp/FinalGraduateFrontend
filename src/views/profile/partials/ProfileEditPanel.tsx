import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { X, Hand, MapPin, Home, Cake, Heart, VenusAndMars, MessageCircle, Globe } from 'lucide-react'
import type { UserProfile } from '@/types/Profile'
import EditableRow from '@/components/profile/EditableRow'

interface ProfileEditPanelProps {
  profile: UserProfile
  onClose: () => void
  onSave: (updatedProfile: Partial<UserProfile>) => void
}

export default function ProfileEditPanel({ profile, onClose, onSave }: ProfileEditPanelProps) {
  const [activeField, setActiveField] = useState<string | null>(null)
  const [draft, setDraft] = useState<Partial<UserProfile>>(profile)

  const handleEdit = (field: string) => {
    if (activeField !== null) return
    setActiveField(field)
  }

  const handleCancel = () => setActiveField(null)

  const handleSaveField = (field: string, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }))
    setActiveField(null)
  }

  const handleFinalSave = () => {
    onSave(draft)
    onClose()
  }

  return (
    <Card className="absolute top-full right-0 mt-2 w-full md:w-[800px] z-50 shadow-lg border">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
        <CardTitle className="text-lg font-bold">Chỉnh sửa trang cá nhân</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full size-8">
          <X className="size-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col md:flex-row max-h-[70vh] overflow-y-auto">
        {/* Cột trái: Giới thiệu */}
        <div className="flex-1 p-4 md:border-r">
          <h3 className="font-semibold mb-3">Giới thiệu</h3>
          <Separator className="mb-4" />
          
          {activeField === 'bio' ? (
            <div className="flex flex-col gap-2 p-2 border rounded-md bg-muted/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Hand className="size-5" />
                <span className="font-medium">Giới thiệu về bạn</span>
              </div>
              <Textarea 
                value={draft.bio || ''} 
                onChange={(e) => setDraft(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Mô tả bản thân..."
                className="resize-none h-24"
                maxLength={101}
                autoFocus
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">{draft.bio?.length || 0}/101</span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCancel}>Hủy</Button>
                  <Button size="sm" onClick={() => setActiveField(null)}>Lưu</Button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className={`flex flex-col gap-2 p-3 border rounded-md transition-colors ${
                activeField !== null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50'
              }`}
              onClick={() => activeField === null && handleEdit('bio')}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">Giới thiệu về bạn</span>
                <Badge variant="secondary" className="text-xs font-normal">Công khai ▼</Badge>
              </div>
              <p className="text-sm text-center py-4">{draft.bio || 'Chưa có thông tin giới thiệu'}</p>
            </div>
          )}
        </div>

        {/* Cột phải: Thông tin cá nhân */}
        <div className="flex-1 p-4">
          <h3 className="font-semibold mb-3">Thông tin cá nhân</h3>
          <Separator className="mb-4" />
          
          <div className="flex flex-col gap-1">
            <EditableRow 
              icon={MapPin} label="Vị trí hiện tại" value={draft.location} placeholder="Thêm vị trí"
              field="location" isActive={activeField === 'location'} isLocked={activeField !== null && activeField !== 'location'}
              onEdit={handleEdit} onSave={handleSaveField} onCancel={handleCancel}
            />
            <EditableRow 
              icon={Home} label="Quê quán" value={draft.hometown} placeholder="Thêm quê quán"
              field="hometown" isActive={activeField === 'hometown'} isLocked={activeField !== null && activeField !== 'hometown'}
              onEdit={handleEdit} onSave={handleSaveField} onCancel={handleCancel}
            />
            <EditableRow 
              icon={Cake} label="Sinh nhật" value={draft.birthday} placeholder="Thêm ngày sinh"
              field="birthday" isActive={activeField === 'birthday'} isLocked={activeField !== null && activeField !== 'birthday'}
              onEdit={handleEdit} onSave={handleSaveField} onCancel={handleCancel}
            />
            <EditableRow 
              icon={Heart} label="Tình trạng mối quan hệ" value={draft.relationship} placeholder="Thêm tình trạng"
              field="relationship" isActive={activeField === 'relationship'} isLocked={activeField !== null && activeField !== 'relationship'}
              onEdit={handleEdit} onSave={handleSaveField} onCancel={handleCancel}
            />
            <EditableRow 
              icon={VenusAndMars} label="Giới tính" value={draft.gender} placeholder="Thêm giới tính"
              field="gender" isActive={activeField === 'gender'} isLocked={activeField !== null && activeField !== 'gender'}
              onEdit={handleEdit} onSave={handleSaveField} onCancel={handleCancel}
            />
            <EditableRow 
              icon={MessageCircle} label="Danh xưng" value={draft.pronouns} placeholder="Thêm danh xưng"
              field="pronouns" isActive={activeField === 'pronouns'} isLocked={activeField !== null && activeField !== 'pronouns'}
              onEdit={handleEdit} onSave={handleSaveField} onCancel={handleCancel}
            />
            <EditableRow 
              icon={Globe} label="Ngôn ngữ" value={draft.language} placeholder="Thêm ngôn ngữ"
              field="language" isActive={activeField === 'language'} isLocked={activeField !== null && activeField !== 'language'}
              onEdit={handleEdit} onSave={handleSaveField} onCancel={handleCancel}
            />
          </div>
        </div>
      </CardContent>
      
      <div className="p-4 border-t bg-muted/20 flex justify-end">
         <Button onClick={handleFinalSave} disabled={activeField !== null}>Xác nhận & Lưu thay đổi</Button>
      </div>
    </Card>
  )
}
