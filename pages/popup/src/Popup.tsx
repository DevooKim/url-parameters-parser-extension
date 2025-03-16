import { parseUrl, useStorage, useTimeout, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { Card, CardContent, CardHeader, cn, CopyButton, Separator } from '@extension/ui';
import { useState } from 'react';
import { CircleCheck } from 'lucide-react';

const testUrl =
  'https://www.example.com/aaa/111/bbb/222/ccc/333/aaa/111/bbb/222/ccc/333/aaa/111/bbb/222/ccc/333/aaa/111/bbb/222/ccc/456';

const testOptions = [
  {
    name: 'example',
    hostname: 'www.example.com',
    patterns: ['/aaa/:a-id', '/bbb/:b-id', '/ccc/:c-id'],
  },
];

const useStatus = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { isActive, reset } = useTimeout(() => {}, 1000);

  const handleSuccess = () => {
    setIsSuccess(true);
    reset();
  };
  const handleFail = () => {
    setIsSuccess(false);
    reset();
  };

  return {
    isSuccess,
    handleSuccess,
    handleFail,
    isActive,
  };
};

const StatusCheckIcon = ({ isSuccess, className }: { isSuccess: boolean; className?: string }) => {
  return (
    <div className={cn(isSuccess ? 'text-green-600' : 'text-red-600', className)}>
      <CircleCheck />
    </div>
  );
};

const ParsedItem = ({
  item,
}: {
  item: {
    key: string;
    value: string;
  };
}) => {
  const { isActive, isSuccess, handleSuccess, handleFail } = useStatus();

  const { key, value } = item;

  return (
    <div className="flex items-center justify-between w-full rounded-md hover:bg-zinc-200">
      <span className="mr-2 text-sm truncate">
        {key} : {value}
      </span>
      <div className="flex items-center gap-1">
        {isActive && <StatusCheckIcon isSuccess={isSuccess} />}
        <CopyButton value={value} onSuccessCopy={handleSuccess} onFailCopy={handleFail} className="w-8 h-8 shrink-0" />
      </div>
    </div>
  );
};

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const [optionName, setOptionName] = useState('example');
  const { isActive, isSuccess, handleSuccess, handleFail } = useStatus();

  const option = testOptions.find(option => option.name === optionName);

  // const url = useUrl();
  const url = testUrl;
  const patterns = option?.patterns || [];

  const parsedUrl = parseUrl(url, patterns);

  return (
    <Card className="w-[420px] p-5 shadow-none border-0 flex flex-col gap-3">
      <CardHeader className="flex items-center justify-between gap-1 p-0 space-y-0">
        <div className="w-full">
          <p className="text-sm font-medium break-all">{url}</p>
        </div>
        <div className="flex items-center justify-center w-full gap-1">
          <StatusCheckIcon isSuccess={isSuccess} className={cn(isActive ? 'block' : 'hidden')} />
          <CopyButton value={url} onSuccessCopy={handleSuccess} onFailCopy={handleFail}>
            복사하기
          </CopyButton>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-between gap-1">
          {Object.entries(parsedUrl).map(([key, value]) => (
            <ParsedItem key={key} item={{ key, value }} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
