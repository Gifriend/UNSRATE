import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="space-y-6">
      {/* Card Skeleton */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Image Placeholder */}
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 animate-pulse" />
        
        {/* Profile Info Placeholder */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-7 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-60 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons Placeholder */}
      <div className="flex justify-center space-x-8">
        <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;