// storage/mmkv.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'staff-storage',
  encryptionKey: 'staff-encryption-key'
});