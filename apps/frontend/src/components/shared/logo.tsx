import { MagicWandIcon } from "@radix-ui/react-icons";

export default function Logo({ ...props }) {
  return (
    <div className="rounded-full bg-black dark:bg-white p-2 w-14 h-14 justify-center items-center">
      <MagicWandIcon className="h-10 w-10 text-white dark:" {...props} />
    </div>
  );
}
