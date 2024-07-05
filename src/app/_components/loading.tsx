export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="absolute h-32 w-32 animate-spin rounded-full border-b-4 border-t-4 border-primary"></div>
      <img
        src="/assets/loading-image.png"
        alt="no loading image"
        className="h-28 w-28 rounded-full"
      />
    </div>
  );
}
