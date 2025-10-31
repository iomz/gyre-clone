export default function LanguageSelector({
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
      value={language}
      onChange={(e) => onChange(e.target.value, topic)}
      className="ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
    >
      <option value="en-US">English (en-US)</option>
      <option value="ja-JP">日本語 (ja-JP)</option>
      <option value="pt-PT">Português (pt-PT)</option>
    </select>
  );
}
