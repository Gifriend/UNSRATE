"use client"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: number;
  sender: 'user' | 'match';
  text: string;
  timestamp: string;
}

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const id = parseInt(params.id);
  const [matchInfo, setMatchInfo] = useState({
    id: id,
    name: id === 1 ? "Dewi" : id === 2 ? "Budi" : "Sinta",
    image: `/profiles/${id === 1 ? "dewi1" : id === 2 ? "budi1" : "sinta1"}.jpg`
  });

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'match', text: 'Halo!', timestamp: '10:30' },
    { id: 2, sender: 'user', text: 'Hai, apa kabar?', timestamp: '10:31' },
    { id: 3, sender: 'match', text: 'Baik, kamu?', timestamp: '10:32' }
  ]);

  const [newMessage, setNewMessage] = useState<string>('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link href="/matches" className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3">
              </div>
              <div>
                <h2 className="font-medium text-black">{matchInfo.name}</h2>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-md space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-pink-500 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-pink-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      </div>
      
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto max-w-md flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
            placeholder="Ketik pesan..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className="bg-pink-500 text-white px-4 py-2 rounded-r-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}