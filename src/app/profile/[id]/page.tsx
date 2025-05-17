import ProfileViewPage from "./components/ProfileViewPage";

export default async function PofilePage({params}:{params: Promise<{id: string}>} ){
  const { id } = await params;
  return <ProfileViewPage params={{id}} />;
} 