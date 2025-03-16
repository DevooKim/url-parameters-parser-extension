import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { settingStorage } from '@extension/storage';
import { Item } from './Item';
import { useState } from 'react';
import { Button } from '@extension/ui';

const testOptions = [
  {
    name: 'example',
    hostname: 'www.example.com',
    patterns: ['/aaa/:a-id', '/bbb/:b-id', '/ccc/:c-id'],
  },
  {
    name: 'example2',
    hostname: 'www.example.com',
    patterns: ['/aaa/:a-id'],
  },
  {
    name: 'example3',
    hostname: 'www.example.com',
    patterns: ['/aaa/:a-id'],
  },
  {
    name: 'example4',
    hostname: 'www.example.com',
    patterns: ['/aaa/:a-id'],
  },
  {
    name: 'example5',
    hostname: 'www.example.com',
    patterns: ['/aaa/:a-id'],
  },
];

const Options = () => {
  const [editModeSequence, setEditModeSequence] = useState<number>(-1);
  const editModeEnable = (sequence: number) => {
    setEditModeSequence(sequence);
  };
  const editModeDisable = () => {
    setEditModeSequence(-1);
  };

  const settings = useStorage(settingStorage);

  const appendItem = async () => {
    await settingStorage.append();
  };

  return (
    <div className="w-screen h-screen text-center">
      <button onClick={() => settingStorage.update(testOptions)}>update setting</button>

      <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">Settings</h1>
      <div className="flex flex-col items-center gap-8">
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
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
