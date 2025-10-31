export default function SpiralCounter({
  numberOfSpirals,
}: {
  numberOfSpirals: number;
}) {
  return (
    <label className="text-gray-300">
      Spirals:
      <input
        type="number"
        value={numberOfSpirals}
        className="ml-2 w-12 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
        readOnly
      />
    </label>
  );
}
