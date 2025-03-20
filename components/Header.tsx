import Link from 'next/link';
import Image from 'next/image';
import satria from '../src/app/assets/img/satria.jpg';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/profile" className="p-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full bg-[../src/app/assets/img/satria.jpg]">
              
            </div>
          </Link>
        </div>
        
        <div>
          <Link href="/swipe">
            <h1 className="text-xl font-bold text-pink-600">UNSRATE</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/matches" className="p-2">
            <div className="w-8 h-8 bg-pink rounded-full flex items-center justify-center bg-pink-500">
              <span className="text-xs font-bold">3</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}