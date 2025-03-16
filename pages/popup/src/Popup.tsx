import { parseUrl, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { Card, CardContent, CardHeader, CopyButton, Separator, useButtonClassName } from '@extension/ui';
import { useState } from 'react';
import { ParsedItem } from './ParsedItem';

const testUrl =
  'https://www.example.com/aaa/111/bbb/222/ccc/333/aaa/111/bbb/222/ccc/333/aaa/111/bbb/222/ccc/333/aaa/111/bbb/222/ccc/456';

const testOptions = [
  {
    name: 'example',
    hostname: 'www.example.com',
    patterns: ['/aaa/:a-id', '/bbb/:b-id', '/ccc/:c-id'],
  },
];

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const [optionName, setOptionName] = useState('example');
  const { className: buttonClassName, handleSuccess, handleFail } = useButtonClassName();

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
        <CopyButton value={url} onSuccessCopy={handleSuccess} onFailCopy={handleFail} className={buttonClassName}>
          복사하기
        </CopyButton>
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
