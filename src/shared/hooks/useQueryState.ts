import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { QueryCodec } from './query-codecs';

interface UseQueryStateOptions {
  replace?: boolean;
}

export function useQueryState<T>(
  key: string,
  codec: QueryCodec<T>,
  options: UseQueryStateOptions = {}
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = useMemo(() => {
    const raw = searchParams.getAll(key);
    return codec.parse(raw.length ? raw : undefined);
  }, [searchParams, key, codec]);

  const setValue = (nextValue: T) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(key);

    const serialized = codec.serialize(nextValue);
    serialized?.forEach((item) => {
      nextParams.append(key, item);
    });

    setSearchParams(nextParams, { replace: options.replace ?? true });
  };

  const clearValue = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(key);
    setSearchParams(nextParams, { replace: options.replace ?? true });
  };

  return {
    value,
    setValue,
    clearValue,
  };
}
