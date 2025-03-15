import { useEffect, useState } from 'react';

export const useUrl = (): string => {
  const [url, setUrl] = useState<string>('');

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    const decodedUrl = decodeURIComponent(tab.url!);

    setUrl(decodedUrl);
  };

  useEffect(() => {
    injectContentScript();
  }, []);

  return url;
};
