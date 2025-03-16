import '@src/Popup.css';
import { parseUrl, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { Button, CopyButton } from '@extension/ui';
import { useState } from 'react';

const testUrl = 'https://www.example.com/aaa/111/bbb/222/ccc/333';
const testPatterns = ['/aaa/:a-id', '/bbb/:b-id', '/ccc/:c-id'];

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const [copySuccess, setCopySuccess] = useState('none');

  // const url = useUrl();
  const url = testUrl;
  const patterns = testPatterns;

  const parsedUrl = parseUrl(url, patterns);

  const handleSuccessCopy = () => {
    setCopySuccess('success');
  };

  const handleFailCopy = () => {
    setCopySuccess('fail');
  };

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <div>{url}</div>
      <CopyButton value={url} onSuccessCopy={handleSuccessCopy} onFailCopy={handleFailCopy}>
        Copy URL
      </CopyButton>

      <hr />

      <ul>
        {Object.entries(parsedUrl).map(([key, value]) => (
          <li key={key}>
            <span className="text-blue-500">{key}</span>: {value}
            <CopyButton value={value} onSuccessCopy={handleSuccessCopy} onFailCopy={handleFailCopy}>
              Copy {key}
            </CopyButton>
          </li>
        ))}
      </ul>

      <h3>{copySuccess}</h3>
      <Button variant="destructive">hello</Button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
