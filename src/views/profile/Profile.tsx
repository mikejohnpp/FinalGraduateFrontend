import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { mockProfile } from '@/data/mock/profileMock'
import { mockPosts } from '@/data/mock/postsMock'
import type { IPost } from '@/types/interfaces/post/IPost'

import ProfileCover from './partials/ProfileCover'
import ProfileTabs from './partials/ProfileTabs'
import ProfileAbout from './partials/ProfileAbout'
import ProfileFriends from './partials/ProfileFriends'
import ProfilePhotos from './partials/ProfilePhotos'
import ProfileCreatePost from './partials/ProfileCreatePost'
import ProfilePostFeed from './partials/ProfilePostFeed'

export default function Profile() {
  const { userId } = useParams()
  const [activeTab, setActiveTab] = useState<string>('posts')
  const [profile, setProfile] = useState(mockProfile)

  // In real app, fetch profile and posts by userId
  if (userId) {
    console.log('Fetching profile for:', userId)
  }
  const posts = mockPosts.map((p, index) => ({
    id: index + 1,
    author: {
      id: p.authorId,
      name: p.authorName,
      avatar: p.authorAvatar,
    },
    isGroupPosted: false,
    content: p.content,
    createdAt: new Date().toISOString(), // Mock proper date
    likeCount: p.likeCount,
    commentCount: p.commentCount,
  })) as unknown as IPost[]

  const handleProfileUpdate = (updatedData: Partial<typeof mockProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedData }))
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/20 pb-10">
      <ProfileCover profile={profile} onProfileUpdate={handleProfileUpdate} />
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 mt-4">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-4">
            <div className="flex flex-col gap-4">
              <ProfileAbout profile={profile} />
              <ProfilePhotos />
              <ProfileFriends profile={profile} />
            </div>
            <div className="flex flex-col">
              <ProfileCreatePost profile={profile} />
              <ProfilePostFeed posts={posts} />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="w-full">
            <ProfileAbout profile={profile} />
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="w-full">
            <ProfileFriends profile={profile} />
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="w-full">
            <ProfilePhotos />
          </div>
        )}
      </div>
    </div>
  )
}
