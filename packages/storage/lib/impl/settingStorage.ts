import type { BaseStorage } from '../base/index.js';
import { createStorage, StorageEnum } from '../base/index.js';

export type Setting = {
  name: string;
  hostname?: string;
  patterns: string[];
};

type SettingStorage = BaseStorage<Setting[]> & {
  append: () => Promise<void>;
  update: (setting: Setting[]) => Promise<void>;
  saveByIndex: (index: number, setting: Setting) => Promise<void>;
  deleteByIndex: (index: number) => Promise<void>;
};

const storage = createStorage<Setting[]>('setting-storage-key', [], {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const settingStorage: SettingStorage = {
  ...storage,
  append: async () => {
    const settings = await storage.get();

    const defaultSetting: Setting = {
      name: `item-${settings.length}`,
      hostname: '',
      patterns: [''],
    };

    await storage.set([...settings, defaultSetting]);
  },
  update: async (settings: Setting[]) => {
    if (!Array.isArray(settings)) {
      throw new Error('Settings should be an array');
    }

    await storage.set(settings);
  },
  saveByIndex: async (index: number, setting: Setting) => {
    const settings = await storage.get();
    if (index < 0 || index >= settings.length) {
      throw new Error('Index out of bounds');
    }

    // 빈 값이 있으면 에러
    if (!setting.name) {
      throw new Error('Setting is invalid');
    }
    // 이름 중복 체크
    const isNameDuplicate = settings.some((s, i) => s.name === setting.name && i !== index);
    if (isNameDuplicate) {
      throw new Error('Name already exists');
    }

    settings[index] = setting;

    await storage.set(settings);
  },
  deleteByIndex: async (index: number) => {
    const settings = await storage.get();
    if (index < 0 || index >= settings.length) {
      throw new Error('Index out of bounds');
    }

    settings.splice(index, 1);

    await storage.set(settings);
  },
};
