import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PostSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <Skeleton className="h-3 w-[60px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
        <div className="flex w-full items-center justify-around border-t pt-2 mt-2">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>
      </CardFooter>
    </Card>
  )
}
