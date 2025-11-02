import { Button } from "@/components/ui/button";

export default function SpawnButton({
  isPending,
  handleSpawn,
}: {
  isPending: boolean;
  handleSpawn: () => void;
}) {
  return (
    <Button
      disabled={isPending}
      onClick={() => handleSpawn()}
      className="hover:bg-white/20"
    >
      Spawn
    </Button>
  );
}
