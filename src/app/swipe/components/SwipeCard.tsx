// import { useState } from 'react';
// import Image from 'next/image';
// import { Heart } from 'lucide-react';

// interface Profile {
//   id: string;
//   name: string;
//   age: number;
//   bio: string;
//   images: string[];
// }

// interface SwipeCardProps {
//   profile: Profile;
// }

// export default function SwipeCard({ profile }: SwipeCardProps) {
//   const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => 
//       prevIndex === profile.images.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prevIndex) => 
//       prevIndex === 0 ? profile.images.length - 1 : prevIndex - 1
//     );
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
//       {/* Image Gallery */}
//       <div className="relative h-96 overflow-hidden">
//         {profile.images.length > 0 ? (
//           <Image
//             src={profile.images[currentImageIndex]}
//             alt={`${profile.name}'s profile`}
//             fill
//             className="object-cover"
//             sizes="(max-width: 768px) 100vw, 400px"
//           />
//         ) : (
//           <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
//             <span>No image</span>
//           </div>
//         )}
//         <div className="absolute bottom-4 right-4 bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
//           <Heart className="inline mr-1" size={16} fill="white" />
//           Super Date
//         </div>
//         {profile.images.length > 1 && (
//           <>
//             <button
//               onClick={prevImage}
//               className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
//             >
//               &lt;
//             </button>
//             <button
//               onClick={nextImage}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
//             >
//               &gt;
//             </button>
//           </>
//         )}
//         <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
//           {profile.images.map((_, index) => (
//             <div
//               key={index}
//               className={`w-2 h-2 rounded-full ${
//                 index === currentImageIndex ? 'bg-white' : 'bg-gray-300'
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//       {/* Profile Info */}
//       <div className="p-6">
//         <div className="flex justify-between items-start">
//           <div>
//             <h2 className="text-2xl font-bold">
//               {profile.name}, <span className="font-normal">{profile.age}</span>
//             </h2>
//             <p className="text-gray-500 mt-1">{profile.bio}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }