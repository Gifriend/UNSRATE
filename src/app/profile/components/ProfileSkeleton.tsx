import { cn } from "@/lib/utils";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderSkeleton />
      <main className="container mx-auto px-4 py-6 md:max-w-4xl lg:max-w-5xl">
        {/* Profile Header Skeleton */}
        <div className="relative mb-6 md:mb-10">
          {/* Background gradient skeleton */}
          <div className="h-40 md:h-60 bg-gray-200 dark:bg-gray-700 rounded-t-3xl animate-pulse"></div>

          {/* Profile picture skeleton */}
          <div className="absolute top-28 left-4 md:top-40 md:left-10">
            <div className="relative rounded-full border-4 border-background bg-gray-200 dark:bg-gray-700 h-24 w-24 md:h-40 md:w-40 animate-pulse"></div>
            <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 h-7 w-7 md:h-10 md:w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>

          {/* Profile completion card skeleton */}
          <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 rounded-lg p-2 md:p-3 animate-pulse">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
            <div className="h-2 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-10 bg-gray-300 dark:bg-gray-600 rounded mt-1"></div>
          </div>

          {/* Profile info skeleton */}
          <div className="pt-16 pb-6 md:pt-20 md:pb-8 md:px-4">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Photos Section Skeleton */}
        <div className="mb-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 md:p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Interests Section Skeleton */}
        <div className="mb-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 md:p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section Skeleton */}
        <div className="space-y-4">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 md:p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="h-16 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 md:p-6 animate-pulse">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Header Skeleton (simple version, adjust based on your Header component)
function HeaderSkeleton() {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 h-16 flex items-center px-4 animate-pulse">
      <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  );
}