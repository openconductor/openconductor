export default function FieldError({ error }: { error: any }) {
  return <span className="text-red-700">{error.message}</span>;
}
