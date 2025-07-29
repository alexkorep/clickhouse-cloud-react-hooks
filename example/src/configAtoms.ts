import { atom } from 'jotai';
import { type ClickHouseConfig } from 'clickhouse-cloud-react-hooks';

export const keyIdAtom = atom<string>(localStorage.getItem('chc_keyId') || '');
export const keySecretAtom = atom<string>(localStorage.getItem('chc_keySecret') || '');
export const configAtom = atom<ClickHouseConfig | null>((get) => {
  const keyId = get(keyIdAtom);
  const keySecret = get(keySecretAtom);
  return keyId && keySecret ? { keyId, keySecret } : null;
});
