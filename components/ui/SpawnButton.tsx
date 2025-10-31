export default function SpawnButton({
  isPending,
  handleSpawn,
}: {
  isPending: boolean;
  handleSpawn: () => void;
}) {
  return (
    <button
      disabled={isPending}
      onClick={() => handleSpawn()}
      className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition"
    >
      Spawn
    </button>
  );
}
