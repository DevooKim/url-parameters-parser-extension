import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { settingStorage } from '@extension/storage';
import { Item } from './Item';
import { useState } from 'react';
import { Button } from '@extension/ui';

const Options = () => {
  const [editModeSequence, setEditModeSequence] = useState<number>(-1);
  const editModeEnable = (sequence: number) => {
    setEditModeSequence(sequence);
  };
  const editModeDisable = () => {
    setEditModeSequence(-1);
  };

  const settings = useStorage(settingStorage);
  const logo = 'options/logo.svg';

  const appendItem = async () => {
    await settingStorage.append();
  };

  return (
    <div className="w-screen h-screen px-10 py-8 text-center">
      <div className="flex flex-col items-center gap-8">
        <img src={chrome.runtime.getURL(logo)} className="w-10 pointer-events-none" alt="logo" />

        <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">Settings</h1>
        <div className="flex flex-col items-center w-full gap-8 ">
          {settings.map((setting, rootIndex) => {
            return (
              <Item
                key={`${setting.name}-${rootIndex}`}
                sequence={rootIndex}
                editMode={editModeSequence === rootIndex}
                editModeEnable={() => editModeEnable(rootIndex)}
                editModeDisable={editModeDisable}
                enableDelete={editModeSequence === -1}
              />
            );
          })}
        </div>

        <Button variant="ghost" onClick={appendItem}>
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
