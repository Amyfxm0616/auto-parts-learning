import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { QueryCodec } from './query-codecs';

type QuerySchema = Record<string, QueryCodec<any>>;

type InferQueryState<TSchema extends QuerySchema> = {
  [K in keyof TSchema]: TSchema[K] extends QueryCodec<infer TValue>
    ? TValue
    : never;
};

interface UseQueryStatesOptions {
  replace?: boolean;
}

export function useQueryStates<TSchema extends QuerySchema>(
  schema: TSchema,
  options: UseQueryStatesOptions = {}
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    const nextState = {} as InferQueryState<TSchema>;

    Object.entries(schema).forEach(([key, codec]) => {
      const raw = searchParams.getAll(key);
      nextState[key as keyof TSchema] = codec.parse(
        raw.length ? raw : undefined
      );
    });

    return nextState;
  }, [searchParams, schema]);

  const setPartialState = (patch: Partial<InferQueryState<TSchema>>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(patch).forEach(([key, value]) => {
      const codec = schema[key];
      if (!codec) return;

      nextParams.delete(key);

      const serialized = codec.serialize(value);
      serialized?.forEach((item) => nextParams.append(key, item));
    });

    setSearchParams(nextParams, { replace: options.replace ?? true });
  };

  const resetState = () => {
    const nextParams = new URLSearchParams(searchParams);

    Object.keys(schema).forEach((key) => {
      nextParams.delete(key);
    });

    setSearchParams(nextParams, { replace: options.replace ?? true });
  };

  return {
    state,
    setPartialState,
    resetState,
  };
}
