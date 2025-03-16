import { parseUrl, useStorage, useUrl, withErrorBoundary, withSuspense } from '@extension/shared';
import { latestOptionNameStorage, settingStorage } from '@extension/storage';
import {
  Card,
  CardContent,
  CopyButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  useButtonClassName,
} from '@extension/ui';
import { useState } from 'react';
import { ParsedItem } from './ParsedItem';

const Popup = () => {
  const settings = useStorage(settingStorage);
  const latestOptionName = useStorage(latestOptionNameStorage);
  const [optionName, setOptionName] = useState(
    settings.some(option => option.name === latestOptionName) ? latestOptionName : settings[0]?.name,
  );
  const { className: buttonClassName, handleSuccess, handleFail } = useButtonClassName();

  const option = settings.find(option => option.name === optionName);

  const handleOptionChange = (optionName: string) => {
    setOptionName(optionName);
    latestOptionNameStorage.set(optionName);
  };

  const url = useUrl();
  const patterns = option?.patterns || [];

  const parsedUrl = parseUrl(url, patterns);

  return (
    <Card className="w-[420px] p-5 shadow-none border-0 flex flex-col gap-4">
      <CardContent className="flex flex-col items-center justify-between gap-1 p-0">
        <div className="w-full">
          <p className="text-sm font-medium break-all">{url}</p>
        </div>
        <CopyButton value={url} onSuccessCopy={handleSuccess} onFailCopy={handleFail} className={buttonClassName}>
          복사하기
        </CopyButton>
      </CardContent>
      <Separator />

      <CardContent className="flex flex-col items-center justify-between gap-1 p-0">
        <Select value={optionName} onValueChange={handleOptionChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {settings.map(option => (
              <SelectItem key={option.name} value={option.name}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold break-all">
          {JSON.stringify(patterns)}
        </code>
      </CardContent>
      <Separator />
      <CardContent className="flex flex-col items-center justify-between gap-1 p-0">
        {Object.entries(parsedUrl).map(([key, value]) => (
          <ParsedItem key={key} item={{ key, value }} />
        ))}
      </CardContent>
    </Card>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
