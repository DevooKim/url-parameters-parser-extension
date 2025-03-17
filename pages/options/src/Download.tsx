import { useStorage } from '@extension/shared';
import { settingStorage } from '@extension/storage';
import { Button } from '@extension/ui';
import { DownloadIcon } from 'lucide-react';

export const Download = () => {
  const settings = useStorage(settingStorage);

  const handleDownload = async () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'url-parameters-parser.setting.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="ghost"
      className="w-full"
      onClick={handleDownload}
      title="Download settings"
      aria-label="Download settings"
      data-testid="download-settings-button">
      Download <DownloadIcon />
    </Button>
  );
};
