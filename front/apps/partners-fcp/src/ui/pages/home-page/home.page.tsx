import { useApiGet } from '@fc/common';

export const HomePage = (): JSX.Element => {
  const helloWorld = useApiGet<string>({
    endpoint: '/api/hello',
  });

  return (
    <div className="content-wrapper-lg text-center" id="page-container">
      {helloWorld}
    </div>
  );
};
