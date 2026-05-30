import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockPhotos = [
  "https://images.unsplash.com/photo-1506744626753-1fa44f4a311b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1470071131384-001b85755536?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=400&fit=crop",
];

export default function ProfilePhotos() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="cursor-pointer text-xl font-bold hover:underline">Ảnh</CardTitle>
        <Button variant="link" className="h-auto p-0 font-normal text-primary">
          Xem tất cả ảnh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-lg">
          {mockPhotos.map((photo, index) => (
            <div key={index} className="aspect-square cursor-pointer">
              <img
                src={photo}
                alt={`Photo ${index}`}
                className="h-full w-full object-cover transition-opacity hover:opacity-90"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
