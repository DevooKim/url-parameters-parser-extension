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
import { useMemo, useState } from 'react';
import { ParsedItem } from './ParsedItem';
import { QueryParsedItem } from './QueryParsedItem';

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

  const pathParams = parseUrl(url, patterns, { includeQuery: false });
  const queryParams = useMemo(() => {
    if (!url) {
      return {};
    }

    const parsedUrl = new URL(url);
    return Object.fromEntries(parsedUrl.searchParams.entries());
  }, [url]);

  const hasPathParams = Object.keys(pathParams).length > 0;
  const hasQueryParams = Object.keys(queryParams).length > 0;

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
      <CardContent className="flex flex-col items-center justify-between gap-3 p-0">
        <div className="w-full">
          <p className="text-xs font-semibold text-zinc-500 mb-1">Path Params</p>
          {hasPathParams ? (
            Object.entries(pathParams).map(([key, value]) => <ParsedItem key={key} item={{ key, value }} />)
          ) : (
            <p className="text-xs text-zinc-400">No path params</p>
          )}
        </div>

        <div className="w-full">
          <p className="text-xs font-semibold text-zinc-500 mb-1">Query Params</p>
          {hasQueryParams ? (
            Object.entries(queryParams).map(([key, value]) => <QueryParsedItem key={key} item={{ key, value }} />)
          ) : (
            <p className="text-xs text-zinc-400">No query params</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
