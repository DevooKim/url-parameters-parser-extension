import { useStorage } from '@extension/shared';
import { settingStorage } from '@extension/storage';

import { Button, Card, Input, Label } from '@extension/ui';
import { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';

type ItemProps = {
  sequence: number;
  editMode: boolean;
  editModeEnable: () => void;
  editModeDisable: () => void;
  enableDelete: boolean;
};

export const Item: React.FC<ItemProps> = ({ sequence, editMode, editModeEnable, editModeDisable, enableDelete }) => {
  const settings = useStorage(settingStorage);
  const item = settings[sequence];

  const [name, setName] = useState(item.name);
  const [patterns, setPatterns] = useState(item.patterns);
  const [hostname, setHostname] = useState(item.hostname);
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [invalidPatternIndices, setInvalidPatternIndices] = useState<number[]>([]);

  const handleDeleteItem = async () => {
    if (!enableDelete) {
      return;
    }
    await settingStorage.deleteByIndex(sequence);
  };

  const handleEditModeEnable = () => {
    editModeEnable();
  };

  const handleEditModeDisable = () => {
    editModeDisable();
    setName(item.name);
    setPatterns(item.patterns);
    setHostname(item.hostname);
    // 유효하지 않은 상태 초기화
    setIsNameInvalid(false);
    setInvalidPatternIndices([]);
  };

  const addPattern = () => {
    setPatterns([...patterns, '']);
    editModeEnable();
  };
  const deletePattern = (index: number) => {
    // 패턴이 하나만 남아있으면 삭제하지 않고 invalid 표시
    if (patterns.length === 1) {
      setInvalidPatternIndices([0]);
      return;
    }

    const newPatterns = [...patterns];
    newPatterns.splice(index, 1);
    setPatterns(newPatterns);
    editModeEnable();
  };
  const handlePatternChange = (index: number, value: string) => {
    const newPatterns = [...patterns];
    newPatterns[index] = value;
    setPatterns(newPatterns);

    // 값이 입력되면 해당 인덱스를 유효하지 않은 목록에서 제거
    if (value.trim() !== '') {
      setInvalidPatternIndices(prev => prev.filter(idx => idx !== index));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // 값이 입력되면 유효하지 않은 상태 제거
    if (e.target.value.trim() !== '') {
      setIsNameInvalid(false);
    }
  };

  const handleSave = async () => {
    let isValid = true;

    // 이름 유효성 검사
    if (!name.trim()) {
      setIsNameInvalid(true);
      isValid = false;
    }

    // 이름 중복 검사
    const isNameDuplicate = settings.some((setting, index) => setting.name === name && index !== sequence);
    if (isNameDuplicate) {
      setIsNameInvalid(true);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const updatedItem = {
      name,
      patterns,
      hostname,
    };
    await settingStorage.saveByIndex(sequence, updatedItem);
    editModeDisable();
  };

  return (
    <Card className="flex flex-col w-full max-w-2xl gap-4 p-4 drop-shadow-md">
      <div className="flex flex-row items-center justify-between">
        <Button className="bg-red-500" onClick={handleDeleteItem} disabled={!enableDelete} size="sm">
          <X />
          Delete
        </Button>

        <div className="flex flex-row items-center justify-end gap-2">
          {editMode && (
            <Button className="text-green-500" onClick={handleSave} size="sm">
              <Save />
              Save
            </Button>
          )}

          {editMode ? (
            <Button className="text-red-500" onClick={handleEditModeDisable} size="sm">
              <X />
              Cancel
            </Button>
          ) : (
            <Button onClick={handleEditModeEnable} size="sm">
              <Pencil />
              Edit
            </Button>
          )}
        </div>
      </div>

      {editMode ? (
        <div id={name} className="flex flex-row items-center gap-2">
          <Label htmlFor={name}>NAME</Label>
          <Input
            className={`text-2xl font-semibold tracking-tight scroll-m-20 ${
              isNameInvalid ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
            value={name}
            onChange={handleNameChange}
          />
        </div>
      ) : (
        <h3 className="text-2xl font-semibold tracking-tight scroll-m-20">{name}</h3>
      )}

      <div className="flex flex-col gap-2">
        {patterns.map((pattern, index) => (
          <div key={index} className="flex flex-row items-center gap-2">
            <Label htmlFor={`${index}`} className="text-nowrap">
              PATTERN {index + 1}
            </Label>
            <Input
              id={`${index}`}
              type="text"
              placeholder={'/aaa/:a-id'}
              value={pattern}
              onChange={e => handlePatternChange(index, e.target.value)}
              readOnly={!editMode}
              className={invalidPatternIndices.includes(index) ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            <Button
              variant="ghost"
              className="text-red-500 hover:bg-red-400 hover:text-white"
              onClick={() => deletePattern(index)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
      <Button variant={'ghost'} onClick={addPattern}>
        Add Pattern
      </Button>
    </Card>
  );
};
