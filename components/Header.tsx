import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/profile" className="p-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </Link>
        </div>
        
        <div>
          <Link href="/swipe">
            <h1 className="text-xl font-bold text-pink-600">DatingApp</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/matches" className="p-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">3</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}