import { posts } from "@/data/mock/home"
import CreatePostCard from "./CreatePostCard"
import PostCard from "./PostCard"
import StoriesBar from "./StoriesBar"

export default function NewsFeed() {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 py-4 px-4">
      <CreatePostCard />
      <StoriesBar />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
