import { useState } from 'react';

export const oauthKeys = {
  access: 'oauth-a',
  refresh: 'oauth-r',
  profile: 'oauth-p',
};

function useLocalStorage<T>(key: string, defaultValue?: any, isJsonFormat?: boolean): [T, (p: T) => void] {
  const initValue = defaultValue || null;

  const [value, setValueToState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);

      if (!item) {
        return initValue;
      }

      return isJsonFormat ? JSON.parse(item) : item;
    } catch (error) {
      return initValue;
    }
  });

  function setValueToStateAndStorage(value: any) {
    try {
      setValueToState(value);

      const inputValue = isJsonFormat && typeof value !== 'string' ? JSON.stringify(value) : value;
      window.localStorage.setItem(key, inputValue);
    } catch (error) {}
  }

  return [value, setValueToStateAndStorage];
}

export default useLocalStorage;
