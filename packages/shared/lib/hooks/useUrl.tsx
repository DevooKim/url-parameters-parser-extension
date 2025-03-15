import { useEffect, useState } from 'react';

export const useUrl = (): string => {
  const [url, setUrl] = useState<string>('');

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    setUrl(tab.url!);
  };

  useEffect(() => {
    injectContentScript();
  }, []);

  return url;
};
