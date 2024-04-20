export default function Label({ name, color }: { name: string; color?: string }) {
  return (
    <div className="flex p-1 border border-gray-700 rounded-lg text-xs items-center">
      <div
        className={`inline-block h-2 w-2 rounded-full mr-1`}
        style={{ backgroundColor: `#${color ? color.toLowerCase() : '000'}` }}
      ></div>
      <span>{name}</span>
    </div>
  );
}
