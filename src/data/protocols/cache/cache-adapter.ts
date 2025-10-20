export interface SetProperties {
  ttl?: number;
}

export interface CacheAdapter {
  set(key: string, value: string, properties?: SetProperties): Promise<void>;
  get(key: string): Promise<string | null>;
}
