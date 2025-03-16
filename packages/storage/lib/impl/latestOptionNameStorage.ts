import type { BaseStorage } from '../base/index.js';
import { createStorage, StorageEnum } from '../base/index.js';

type LatestOptionNameStorage = BaseStorage<string>;

const storage = createStorage<string>('latest-optionName-storage-key', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const latestOptionNameStorage: LatestOptionNameStorage = {
  ...storage,
};
