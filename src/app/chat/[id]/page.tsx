import ChatPageComponent from './components/ChatPageComponent';
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ChatPage({ params }: PageProps) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    notFound();
  }

  return <ChatPageComponent id={id} />;
}