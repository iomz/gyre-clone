import { Label } from "@/components/ui/label";

export default function SpiralCounter({
  numberOfSpirals,
}: {
  numberOfSpirals: number;
}) {
  return <Label className="">{numberOfSpirals}</Label>;
}
