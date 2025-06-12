import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import type { UserProfile } from "./ProfileViewPage";
import { useRouter } from "next/navigation";

interface ImageCarouselProps {
  images: string[];
  activeImageIndex: number;
  setActiveImageIndex: Dispatch<SetStateAction<number>>;
  profile: UserProfile;
}

export default function ImageCarousel({
  images,
  activeImageIndex,
  setActiveImageIndex,
  profile,
}: ImageCarouselProps) {
  const router = useRouter();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 text-muted-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      <div className="relative mb-6 rounded-xl overflow-hidden bg-muted">
        <div className="aspect-[3/2] md:aspect-[2/1] relative">
          <Image
            src={images[activeImageIndex] || "/placeholder.svg?height=400&width=400"}
            alt={`${profile.fullname}'s photo`}
            fill
            className="object-cover transition-opacity duration-300"
            priority
          />
          {images.length > 1 && (
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    activeImageIndex === index ? "bg-white w-6" : "bg-white/60 hover:bg-white/80"
                  )}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          )}
          {images.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 w-1/4 flex items-center justify-start px-4 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm"
                  onClick={() =>
                    setActiveImageIndex((prev: number) =>
                      prev > 0 ? prev - 1 : images.length - 1
                    )
                  }
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-end px-4 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm"
                  onClick={() =>
                    setActiveImageIndex((prev: number) =>
                      prev < images.length - 1 ? prev + 1 : 0
                    )
                  }
                >
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </Button>
              </div>
            </>
          )}
          {profile.online && (
            <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
              <span className="h-2 w-2 rounded-full bg-white mr-1.5"></span>
              Online now
            </div>
          )}
          {profile.compatibility && (
            <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
              <Heart className="h-3 w-3 mr-1 fill-current" />
              {profile.compatibility}% Match
            </div>
          )}
        </div>
      </div>
    </>
  );
}