import { cn } from "@/lib/utils";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Dashboard Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <div className="h-10 w-full sm:w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Stat Cards Skeleton */}
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 animate-pulse"
                >
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 w-40 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>

            {/* Dashboard Tabs Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              {/* User Table Skeleton */}
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        {["Nama", "NIM", "Status", "Laporan", "Aksi"].map(
                          (header, index) => (
                            <th
                              key={index}
                              className={cn(
                                "p-4",
                                index === 4 ? "text-right" : "text-left"
                              )}
                            >
                              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          </td>
                          <td className="p-4">
                            <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          </td>
                          <td className="p-4">
                            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Skeleton */}
                <div className="flex justify-between items-center p-4 border-t">
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}