import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProfile, useUserPosts } from "@/hooks/useProfile";
import OverlaySpinner from "@/components/OverlaySpinner";

import ProfileCover from "./partials/ProfileCover";
import ProfileTabs from "./partials/ProfileTabs";
import ProfileAbout from "./partials/ProfileAbout";
import ProfileFriends from "./partials/ProfileFriends";
import ProfilePhotos from "./partials/ProfilePhotos";
import ProfileCreatePost from "./partials/ProfileCreatePost";
import ProfilePostFeed from "./partials/ProfilePostFeed";

export default function Profile() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState<string>("posts");

  const { profile, isOwner, loading, error } = useProfile(userId);
  const { posts, loading: postsLoading } = useUserPosts(userId);

  if (loading) return <OverlaySpinner show text="Đang tải trang cá nhân..." />;
  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <p>{error ?? "Không tìm thấy người dùng"}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 pb-10">
      <ProfileCover profile={profile} isOwner={isOwner} />
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mx-auto mt-4 w-full max-w-5xl px-4 sm:px-8">
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_3fr]">
            <div className="flex flex-col gap-4">
              <ProfileAbout profile={profile} isOwner={isOwner} />
              <ProfilePhotos />
              <ProfileFriends profile={profile} />
            </div>
            <div className="flex flex-col">
              {isOwner && <ProfileCreatePost profile={profile} isOwner={isOwner} />}
              <ProfilePostFeed posts={posts} loading={postsLoading} />
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="w-full">
            <ProfileAbout profile={profile} isOwner={isOwner} />
          </div>
        )}

        {activeTab === "friends" && (
          <div className="w-full">
            <ProfileFriends profile={profile} />
          </div>
        )}

        {activeTab === "photos" && (
          <div className="w-full">
            <ProfilePhotos />
          </div>
        )}
      </div>
    </div>
  );
}
