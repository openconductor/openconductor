export default function HeaderTitle({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold leading-6 ">{title}</h1>
        <p className="mt-2 text-sm text-neutral-700">{description}</p>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">{children}</div>
    </div>
  );
}
