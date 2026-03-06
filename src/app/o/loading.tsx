import { Spinner } from "@/shared/components/ui/spinner";

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  );
};
export default Loading;
