export interface QueryCodec<T> {
  parse: (raw: string[] | undefined) => T;
  serialize: (value: T) => string[] | undefined;
}

export function stringCodec(defaultValue = ''): QueryCodec<string> {
  return {
    parse(raw) {
      if (!raw?.length) return defaultValue;
      return raw[0] ?? defaultValue;
    },
    serialize(value) {
      if (value === undefined || value === null) return undefined;
      const normalized = String(value).trim();
      return normalized ? [normalized] : undefined;
    },
  };
}

export function enumCodec<T extends string>(
  allowed: readonly T[],
  defaultValue: T
): QueryCodec<T> {
  return {
    parse(raw) {
      const value = raw?.[0];
      if (!value) return defaultValue;
      return allowed.includes(value as T) ? (value as T) : defaultValue;
    },
    serialize(value) {
      if (!value) return undefined;
      return allowed.includes(value) ? [value] : [defaultValue];
    },
  };
}

export function numberCodec(defaultValue: number): QueryCodec<number> {
  return {
    parse(raw) {
      const value = raw?.[0];
      if (!value) return defaultValue;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? defaultValue : parsed;
    },
    serialize(value) {
      if (value === undefined || value === null) return undefined;
      return [String(value)];
    },
  };
}

export function booleanCodec(defaultValue = false): QueryCodec<boolean> {
  return {
    parse(raw) {
      const value = raw?.[0];
      if (!value) return defaultValue;
      return value === 'true';
    },
    serialize(value) {
      if (value === undefined || value === null) return undefined;
      return [value ? 'true' : 'false'];
    },
  };
}

export function stringArrayCodec(defaultValue: string[] = []): QueryCodec<string[]> {
  return {
    parse(raw) {
      if (!raw?.length) return defaultValue;
      return raw.filter(Boolean);
    },
    serialize(value) {
      if (!value?.length) return undefined;
      const normalized = value.map((item) => item.trim()).filter(Boolean);
      return normalized.length ? normalized : undefined;
    },
  };
}
