import ChatPageComponent from './components/ChatPageComponent';

export default async function ChatPage({ params }: {params: Promise<{id: string}>}) {
  const {id} = await params;

  return <ChatPageComponent params={{id}} />;
}