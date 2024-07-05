export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-white">My chat is {params.id}</h1>
    </div>
  );
}
