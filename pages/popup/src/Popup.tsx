import { useStorage, useUrl, withErrorBoundary, withSuspense } from '@extension/shared';
import { latestOptionNameStorage, settingStorage } from '@extension/storage';
import {
  Button,
  Card,
  CardContent,
  CopyButton,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  useButtonClassName,
} from '@extension/ui';
import { useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';

type PathParamMeta = {
  key: string;
  value: string;
  segmentIndex: number;
};

const hasNoExplicitRootSlash = (url: string): boolean => /^https?:\/\/[^/?#]+(?:\?|#|$)/.test(url);

const stringifyUrl = (parsedUrl: URL, previousUrl: string): string => {
  const nextUrl = parsedUrl.toString();

  if (parsedUrl.pathname === '/' && hasNoExplicitRootSlash(previousUrl)) {
    return nextUrl.replace(/^(https?:\/\/[^/?#]+)\/(\?|#|$)/, '$1$2');
  }

  return nextUrl;
};

const getPathParamMeta = (url?: string, patterns: string[] = []): PathParamMeta[] => {
  if (!url) {
    return [];
  }

  const parsedUrl = new URL(url);
  const pathSegments = decodeURI(parsedUrl.pathname).split('/').filter(Boolean);
  const collected = new Map<string, PathParamMeta>();

  for (const pattern of patterns) {
    const patternSegments = pattern.split('/').filter(Boolean);

    for (let i = 0; i <= pathSegments.length - patternSegments.length; i++) {
      let matched = true;
      const current: PathParamMeta[] = [];

      for (let j = 0; j < patternSegments.length; j++) {
        const patternSeg = patternSegments[j];
        const pathSeg = pathSegments[i + j];

        if (!pathSeg) {
          matched = false;
          break;
        }

        if (patternSeg.startsWith(':')) {
          current.push({ key: patternSeg.substring(1), value: pathSeg, segmentIndex: i + j });
          continue;
        }

        if (patternSeg !== pathSeg) {
          matched = false;
          break;
        }
      }

      if (matched) {
        current.forEach(item => {
          collected.set(item.key, item);
        });
        break;
      }
    }
  }

  return [...collected.values()];
};

const Popup = () => {
  const settings = useStorage(settingStorage);
  const latestOptionName = useStorage(latestOptionNameStorage);
  const [optionName, setOptionName] = useState(
    settings.some(option => option.name === latestOptionName) ? latestOptionName : settings[0]?.name,
  );
  const { className: buttonClassName, handleSuccess, handleFail } = useButtonClassName();

  const option = settings.find(option => option.name === optionName);
  const patterns = useMemo(() => option?.patterns ?? [], [option?.patterns]);

  const currentUrl = useUrl();
  const [editableUrl, setEditableUrl] = useState('');

  useEffect(() => {
    setEditableUrl(currentUrl);
  }, [currentUrl]);

  const pathParamMeta = useMemo(() => getPathParamMeta(editableUrl, patterns), [editableUrl, patterns]);

  const queryParams = useMemo(() => {
    if (!editableUrl) {
      return {};
    }

    const parsedUrl = new URL(editableUrl);
    return Object.fromEntries(parsedUrl.searchParams.entries());
  }, [editableUrl]);

  const hasPathParams = pathParamMeta.length > 0;
  const hasQueryParams = Object.keys(queryParams).length > 0;

  const handleOptionChange = (newOptionName: string) => {
    setOptionName(newOptionName);
    latestOptionNameStorage.set(newOptionName);
  };

  const updatePathParam = (key: string, newValue: string) => {
    if (!editableUrl) {
      return;
    }

    const targetParam = pathParamMeta.find(param => param.key === key);
    if (!targetParam) {
      return;
    }

    const parsedUrl = new URL(editableUrl);
    const pathSegments = decodeURI(parsedUrl.pathname).split('/').filter(Boolean);
    pathSegments[targetParam.segmentIndex] = newValue;

    parsedUrl.pathname = `/${pathSegments.map(segment => encodeURIComponent(segment)).join('/')}`;
    setEditableUrl(stringifyUrl(parsedUrl, editableUrl));
  };

  const updateQueryParam = (key: string, newValue: string) => {
    if (!editableUrl) {
      return;
    }

    const parsedUrl = new URL(editableUrl);
    parsedUrl.searchParams.set(key, newValue);
    setEditableUrl(stringifyUrl(parsedUrl, editableUrl));
  };

  const sendUrl = async () => {
    if (!editableUrl) {
      return;
    }

    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab?.id) {
      await chrome.tabs.update(tab.id, { url: editableUrl });
      window.close();
    }
  };

  const handleEnterToSend = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      void sendUrl();
    }
  };

  return (
    <Card className="w-[420px] p-5 shadow-none border-0 flex flex-col gap-4">
      <CardContent className="flex flex-col items-center justify-between gap-2 p-0">
        <div className="w-full rounded-md border border-input bg-muted/20 px-3 py-2">
          <p className="text-sm break-all">{editableUrl}</p>
        </div>
        <div className="flex items-center gap-2 w-full">
          <CopyButton
            value={editableUrl}
            onSuccessCopy={handleSuccess}
            onFailCopy={handleFail}
            className={buttonClassName}>
            복사하기
          </CopyButton>
          <Button onClick={() => void sendUrl()} className="ml-auto">
            호출
          </Button>
        </div>
      </CardContent>
      <Separator />

      <CardContent className="flex flex-col items-center justify-between gap-1 p-0">
        <Select value={optionName} onValueChange={handleOptionChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {settings.map(item => (
              <SelectItem key={item.name} value={item.name}>
                {item.name}
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
            pathParamMeta.map(item => (
              <div key={item.key} className="flex items-center gap-2 py-1">
                <span className="text-xs text-zinc-500 w-20 shrink-0">{item.key}</span>
                <Input
                  value={item.value}
                  onChange={event => updatePathParam(item.key, event.target.value)}
                  onKeyDown={handleEnterToSend}
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-400">No path params</p>
          )}
        </div>

        <div className="w-full">
          <p className="text-xs font-semibold text-zinc-500 mb-1">Query Params</p>
          {hasQueryParams ? (
            Object.entries(queryParams).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 py-1">
                <span className="text-xs text-zinc-500 w-20 shrink-0">{key}</span>
                <Input
                  value={value}
                  onChange={event => updateQueryParam(key, event.target.value)}
                  onKeyDown={handleEnterToSend}
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-400">No query params</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
