import { settingStorage, type Setting } from '@extension/storage';
import { Button, Input } from '@extension/ui';
import { useRef, useState } from 'react';

// TODO i18n
const MODE_TEXT = {
  overwrite: '덮어쓰기',
  append: '추가하기',
};

export const Upload: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState(false);
  const [mode, setMode] = useState<'overwrite' | 'append'>('append');
  const [newSettings, setNewSettings] = useState<Setting[]>([]);

  const buttonDisabled = newSettings.length === 0;

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async e => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        const json = JSON.parse(content);
        setNewSettings(json);
      }
    };
    reader.readAsText(file);
  };

  const onClickOverwrite = () => {
    setConfirm(true);
    setMode('overwrite');
  };

  const onClickAppend = () => {
    setConfirm(true);
    setMode('append');
  };
  const onClickConfirm = async () => {
    if (mode === 'overwrite') {
      await settingStorage.update(newSettings);
    } else if (mode === 'append') {
      await settingStorage.append(newSettings);
    }
    setConfirm(false);
    setNewSettings([]);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  const onClickCancel = () => {
    setConfirm(false);
  };

  return (
    <div className="w-full flex items-center justify-center flex-col">
      <div className="pb-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">설정 파일 업로드</h3>
      </div>
      <div className="flex flex-row items-center justify-between max-w-3xl w-full">
        <Input ref={inputRef} type="file" id="file" accept=".json" onChange={fileChangeHandler} className="max-w-sm" />
        <div>
          {confirm ? (
            <div className="flex flex-row items-center gap-2">
              <div className="text-yellow-500 text-base font-semibold">{MODE_TEXT[mode]}</div>
              <Button
                variant="ghost"
                className="text-green-500 hover:bg-green-400 hover:text-black"
                onClick={onClickConfirm}
                disabled={buttonDisabled}>
                확인
              </Button>
              <Button variant="ghost" onClick={onClickCancel} disabled={buttonDisabled}>
                취소
              </Button>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-2">
              <Button variant="ghost" onClick={onClickOverwrite} disabled={buttonDisabled}>
                덮어쓰기
              </Button>
              <Button variant="ghost" onClick={onClickAppend} disabled={buttonDisabled}>
                추가하기
              </Button>
            </div>
          )}
        </div>
      </div>
      {Boolean(newSettings.length) && (
        <div className="border-2 border-gray-300 rounded-md p-4 mt-4 w-full max-w-3xl">
          <code className="w-full max-w-sm p-4 mt-4 text-left">
            <pre>{JSON.stringify(newSettings, null, 2)}</pre>
          </code>
        </div>
      )}
    </div>
  );
};
