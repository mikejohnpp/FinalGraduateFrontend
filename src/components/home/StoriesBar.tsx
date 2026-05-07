import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { stories } from "@/data/mock/home"
import StoryItem from "./StoryItem"

export default function StoriesBar() {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-3 py-2">
        <StoryItem story={stories[0]} isCreate />
        {stories.slice(1).map((story) => (
          <StoryItem key={story.id} story={story} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
