import { Spinner } from '@/shared/ui/Spinner';

const LoadingPage = () => {
  return (
    <div className="grid h-full place-items-center">
      <Spinner className="fill-main-blue" width="64" height="64" />
    </div>
  );
};

export default LoadingPage;
