interface ActionButtonsProps {
    onDislike: () => void;
    onLike: () => void;
  }
  
  export default function ActionButtons({ onDislike, onLike}: ActionButtonsProps) {
    return (
      <div className="flex justify-center space-x-6 mt-6">
        <button 
          onClick={onDislike}
          className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          onClick={onLike}
          className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }