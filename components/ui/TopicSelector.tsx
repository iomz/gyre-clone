export default function TopicSelector({
  language,
  topic,
  onChange,
}: {
  language: string;
  topic: string;
  onChange: (language: string, topic: string) => void;
}) {
  return (
    <select
      value={topic}
      onChange={(e) => onChange(language, e.target.value)}
      className="ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
    >
      <option value="love">Love</option>
      <option value="philosophy">Philosophy</option>
      <option value="politics">Politics</option>
      <option value="science">Science</option>
    </select>
  );
}
